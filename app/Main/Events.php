<?php

namespace App\Main;

class Events
{
    public static array $events_endpoints = [
        'user' => 'users/',
        'call_type' => 'call_types/',
        'call_category' => 'call_categories/',
        'call_sub_category' => 'call_sub_categories/',
        'session' => 'sessions/user/',
        'ticket' => 'tickets/',
        'role' => 'roles/',
        'permission' => 'permissions/',
        'department' => 'departments/',
        'district' => 'districts/',
        'upazila' => 'upazilas/',
        'location' => 'locations/',
        'dealer' => 'dealers/',
        'product' => 'products/',
        'product_model' => 'product_models/',
        'product_model_variant' => 'product_model_variants/',
        's_m_t_p' => 's_m-_t_p_s/',
        'customer_profile' => 'customer_profiles'
    ];
    public static array $event_names = [
        'new' => 'New',
        'update' => 'Update',
        'read' => 'Read',
        'delete' => 'Delete',
        'restore' => 'Restore',
        'status' => 'Status',
        'assign' => 'Assign',
        'dispatch' => 'Dispatch',
        'solve' => 'Solve',
        'forward' => 'Forward',
        'login' => 'Login',
        'logout' => 'Logout',

    ];

    public static array $events = [
        'user' => 'User',
        'call_type' => 'Call Type',
        'call_category' => 'Call Category',
        'call_sub_category' => 'Call Sub Category',
        'session' => 'Session',
        'ticket' => 'Ticket',
        'role' => 'Role',
        'permission' => 'Permission',
        'department' => 'Department',
        'district' => 'District',
        'upazila' => 'Upazila',
        'location' => 'Location',
        'dealer' => 'Dealer',
        'product' => 'Product',
        'product_model' => 'Product Model',
        'product_model_variant' => 'Product Model Variant',
        'call_sub_category_mail' => 'Call Sub Category Mail',
        's_m_t_p' => 'SMTP',
        'customer_profile' => 'Customer Profile'
    ];
}
