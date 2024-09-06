<?php

namespace App\Main\Report;

use App\Models\Ticket as ModelsTicket;
use Illuminate\Support\Facades\DB;

class Ticket
{
    private static array $forall = [
        'tickets.id',
        'tickets.tracking_id',
        'cp.customer_name',
        'cp.customer_phone',
        'tickets.call_type_id',
        'call_types.name as call_type_name',
        'tickets.call_category_id',
        'call_categories.name as call_category_name',
        'tickets.call_sub_category_id',
        'cc.name as call_sub_category_name',
        'tickets.product_id',
        'products.name as product_name',
        'tickets.product_model_id',
        'product_models.name as product_model_name',
        'tickets.product_model_variant_id',
        'product_model_variants.name as product_model_variant_name',
        'tickets.department_id',
        'departments.name as department_name'
    ];

    private static array $forone = [
        'tickets.*',
        'call_types.name as call_type_name',
        'call_categories.name as call_category_name',
        'cc.name as call_sub_category_name',
        'products.name as product_name',
        'product_models.name as product_model_name',
        'product_model_variants.name as product_model_variant_name',
        'ticket_has_remarks.remarks as ticket_remarks'
    ];

    private static function generate(array $queries = [], array $cols = [])
    {
        $ticket = DB::table('tickets')
            ->leftJoin('customer_profiles as cp','tickets.customer_phone','=','cp.customer_phone')
            ->leftJoin('ticket_has_remarks', 'tickets.id', '=', 'ticket_has_remarks.id')
            ->leftJoin('call_types', 'tickets.call_type_id', '=', 'call_types.id')
            ->leftJoin('call_categories', 'tickets.call_category_id', '=', 'call_categories.id')
            ->leftJoin('call_sub_categories as cc', 'tickets.call_sub_category_id', '=', 'cc.id')
            ->leftJoin('departments', 'cc.department_id', '=', 'departments.id')
            ->leftJoin('products', 'tickets.product_id', '=', 'products.id')
            ->leftJoin('product_models', 'tickets.product_model_id', '=', 'product_models.id')
            ->leftJoin('product_model_variants', 'tickets.product_model_variant_id', '=', 'product_model_variants.id')
            ->select($cols)
            ->whereNull('tickets.deleted_at');

        foreach ($queries as $key => $value) {
            if ($key == 'id') {
                $ticket->where('tickets.id', $value);
                continue;
            }
            $ticket->where('tickets.' . $key, $value);
        }

        return $ticket;
    }
    public static function all(array $queries = [])
    {
        return self::generate($queries, self::$forall)->get([]);
    }

    public static function find(array $queries = [])
    {
        return self::generate($queries, self::$forone)->get()->first();
    }

    public static function count(array $queries = [])
    {
        return self::generate($queries, self::$forall)->count();
    }

    public static function sum(array $queries = [], string $column)
    {
        return self::generate($queries, self::$forall)->sum($column);
    }
    public static function generateId()
    {
        $last_id = DB::table('tickets')->orderBy(DB::raw('CAST(SUBSTRING_INDEX(tracking_id, "-", -1) AS UNSIGNED)'), 'desc')->first();

        if (!$last_id) {
            return "UML-1";
        }
        $str_arr = explode('-', $last_id->tracking_id);

        $number = intval($str_arr[1]) + 1;

        return $str_arr[0] . '-' . $number;
    }
}
