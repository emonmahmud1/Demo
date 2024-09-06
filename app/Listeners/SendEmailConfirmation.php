<?php

namespace App\Listeners;

use App\Events\TicketCreated;
use App\Main\API\Message;
use App\Main\API\Response;
use App\Main\EmailServices;
use App\Models\CallSubCategory;
use App\Models\SMTP;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class SendEmailConfirmation implements ShouldQueue
{
    /**
     * Handle the event.
     *
     * @param TicketCreated $event
     * @return void
     */
    public function handle(TicketCreated $event): void
    {
        $ticket=$event->ticket;
        $department = DB::table('call_sub_categories')->whereNull('deleted_at')->where('id',$ticket->call_sub_category_id)->first();

        $checkCallSubCategory = DB::table('call_sub_categories')->where('id', $ticket->call_sub_category_id)->whereNull('deleted_at')->exists();
        $checkDepartment = DB::table('departments')->where('id', $department->department_id)->whereNull('deleted_at')->exists();

            
        if ($checkCallSubCategory && $checkDepartment) {
            $csc_mail = DB::table('call_sub_categories')->where('id', $ticket->call_sub_category_id)->whereNull('deleted_at')->first();
            $dept_mail = DB::table('departments')->where('id', $department->department_id)->whereNull('deleted_at')->first();

            $to_list = array_merge(json_decode($csc_mail->to_list) ?? [], json_decode($dept_mail->to_list) ?? []);
            $cc = array_merge(json_decode($csc_mail->cc) ?? [], json_decode($dept_mail->to_list) ?? []);
            $bcc = array_merge(json_decode($csc_mail->bcc) ?? [], json_decode($dept_mail->to_list) ?? []);

            $data = [
                'to_list' => $to_list,
                'message' => 'This is my final message',
                'bcc' => $bcc,
                'cc' => $cc,
            ];

            $smtp= SMTP::find( CallSubCategory::find($ticket->call_sub_category_id)->s_m_t_p_id);

            $mailConfig = [
                'transport' => $smtp->mail_mailer,
                'host' => $smtp->mail_host,
                'port' => $smtp->mail_port,
                'encryption' => $smtp->mail_encryption,
                'username' => $smtp->mail_username,
                'password' => $smtp->mail_password,
                
            ];

            Config::set('mail.mailers.smtp', $mailConfig);

            $fromArray = [
                'name' => $smtp->mail_from_name,
                'address' => $smtp->mail_from_address
            ];

            Config::set('mail.from', $fromArray);

            Artisan::call('config:clear');         
            $response=EmailServices::SendEmail($data);
            if ($response->isSuccessful()) {
                Log::info('Email sent successfully for ticket: ' . $ticket->id);
            } else {
                Log::error('Failed to send email for ticket: ' . $ticket->id);
            }
            
        }
    }
}
