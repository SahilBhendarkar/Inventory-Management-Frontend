import { MODULE } from "@/enum/Module";
import { ROLE } from "@/enum/User";

export type Permission = {
    read: boolean;
    write: boolean;
};


export const getModuleAccess = (role: ROLE, module: MODULE): Permission => {
    switch (role) {
        case ROLE.ADMIN:
            switch (module) {
                default:
                    return { read: true, write: true };
            }

        case ROLE.CUSTOMER:
            switch (module) {
                case MODULE.PRODUCT_MANAGEMENT:
                    return { read: true, write: false };
                default:
                    return { read: false, write: false };
            }
        case ROLE.DEALER:
            switch (module) {
                case MODULE.PRODUCT_MANAGEMENT:
                    return { read: true, write: true }
                case MODULE.USER_MANAGEMENT:
                    return { read: false, write: false }
                default:
                    return { read: true, write: false };
            }
        default:
            return { read: false, write: false };
    }
};
