import { MODULE } from "@/enum/Module";
import { ROLE } from "@/enum/User";
import { Permission } from '@/utils/module_access';

export type RolePermission<M extends string> = {
    [key in M]: Permission;
};


export const getPermission = (role: ROLE): any => {
    switch (role) {
        case ROLE.CUSTOMER:
            return CustomerPermission
        case ROLE.DEALER:
            return DealerPermission
        case ROLE.ADMIN:
            return AdminPermission
        default:
            return CustomerPermission
    }
}

const CustomerPermission = {
    [MODULE.DASHBOARD]: {
        read: true,
        write: true,
    },
    [MODULE.PRODUCT_MANAGEMENT]: {
        read: true,
        write: false,
    },
    [MODULE.TRANSACTIONS]: {
        read: false,
        write: false,
    },
    [MODULE.USER_MANAGEMENT]: {
        read: false,
        write: false,
    }
};



const DealerPermission = {
    [MODULE.DASHBOARD]: {
        read: true,
        write: true,
    },
    [MODULE.PRODUCT_MANAGEMENT]: {
        read: true,
        write: true,
    },
    [MODULE.TRANSACTIONS]: {
        read: true,
        write: true,
    },
    [MODULE.USER_MANAGEMENT]: {
        read: false,
        write: false,
    }
};


const AdminPermission = {
    [MODULE.DASHBOARD]: {
        read: true,
        write: true,
    },
    [MODULE.PRODUCT_MANAGEMENT]: {
        read: true,
        write: true,
    },
    [MODULE.TRANSACTIONS]: {
        read: true,
        write: true,
    },
    [MODULE.USER_MANAGEMENT]: {
        read: true,
        write: true,
    }
};
