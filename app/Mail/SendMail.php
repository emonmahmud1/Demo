<?php

namespace App\Mail;

use App\Models\SMTP;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Config;

class SendMail extends Mailable
{
    use Queueable, SerializesModels;
    
    public $data;
    

    /**
     * Create a new message instance.
     */
    public function __construct( array $data)
    {
        $this->data = $data;    
    }

    /**
     * Get the message envelope.
     */
    public function envelope()
    {
        return new Envelope(
            subject: 'Send Mail Testing',
            cc: $this->data['cc'],
            bcc: $this->data['bcc'] 
        );
    }
    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'test',
            with: [
                'value'=>$this->data['message']??'',
                'cc'=>$this->data['cc'],
                'bcc'=>$this->data['bcc']
                
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
