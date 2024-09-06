<?php

namespace App\Main;

use Illuminate\Contracts\Auth\Authenticatable;

class Permissions
{
    public static array $permissions = [
        'user' => [
            'create' => 'Create',
            'read' => 'Read',
            'update' => 'Update',
            'delete' => 'Delete',
            'restore' => 'Restore',
        ],
        'call_type' => [
            'create' => 'Create',
            'read' => 'Read',
            'update' => 'Update',
            'delete' => 'Delete',
            'restore' => 'Restore',
            'status' => 'Status'
        ],
        'call_category' => [
            'create' => 'Create',
            'read' => 'Read',
            'update' => 'Update',
            'delete' => 'Delete',
            'restore' => 'Restore',
            'status' => 'Status'
        ],
        'call_sub_category' => [
            'create' => 'Create',
            'read' => 'Read',
            'update' => 'Update',
            'delete' => 'Delete',
            'restore' => 'Restore',
            'status' => 'Status'
        ],
        'session' => [
            'read' => 'Read',
            'delete' => 'Delete'
        ],
        'ticket' => [
            'create' => 'Create',
            'read' => 'Read',
            'update' => 'Update',
            'delete' => 'Delete',
            'restore' => 'Restore',
            'status' => 'Status',
            'dispatch' => 'Dispatch',
            'remarks' => 'Remarks',
            'forward' => 'Forward',
            'solve' => 'Solve'
        ],
        'role' => [
            'create' => 'Create',
            'read' => 'Read',
            'update' => 'Update',
            'delete' => 'Delete',
            'assign' => 'Assign' //assign roles to user
        ],
        'permission' => [
            'read' => 'Read',
            'assign' => 'Assign', //assign permissions to role
            'assign-user' => 'Assign-User' //assign permissions to user
        ],
        'roles-perms' => [
            'read' => 'Read' //show the user permisisons and roles along with user info
        ],
        'department' => [
            'create' => 'Create',
            'read' => 'Read',
            'update' => 'Update',
            'delete' => 'Delete',
            'restore' => 'Restore'
        ],
        'district' => [
            'create' => 'Create',
            'read' => 'Read',
            'update' => 'Update',
            'delete' => 'Delete',
            'restore' => 'Restore'
        ],
        'upazila' => [
            'create' => 'Create',
            'read' => 'Read',
            'update' => 'Update',
            'delete' => 'Delete',
            'restore' => 'Restore'
        ],
        'location' => [
            'create' => 'Create',
            'read' => 'Read',
            'update' => 'Update',
            'delete' => 'Delete',
            'restore' => 'Restore'
        ],
        'dealer' => [
            'create' => 'Create',
            'read' => 'Read',
            'update' => 'Update',
            'delete' => 'Delete',
            'restore' => 'Restore'
        ],
        'product' => [
            'create' => 'Create',
            'read' => 'Read',
            'update' => 'Update',
            'delete' => 'Delete',
            'restore' => 'Restore'
        ],
        'product_model' => [
            'create' => 'Create',
            'read' => 'Read',
            'update' => 'Update',
            'delete' => 'Delete',
            'restore' => 'Restore'
        ],
        'product_model_variant' => [
            'create' => 'Create',
            'read' => 'Read',
            'update' => 'Update',
            'delete' => 'Delete',
            'restore' => 'Restore'
        ],
        's_m_t_p' => [
            'create' => 'Create',
            'read' => 'Read',
            'update' => 'Update',
            'delete' => 'Delete',
            'restore' => 'Restore',
        ],
        'dashboard' => [
            'read' => 'Read',
        ],
        'customer_profile' => [
            'read' => 'Read'
        ]
    ];
}
