
import { ROLE } from '../constants/constants';

export const getUserRoleText = (roleNumber)=> {

         switch(roleNumber) {
                      case ROLE.OWNER: {
                        
                          return "Owner / Super Admin"
                      }

                      case ROLE.SUPER_ADMIN: {

                        return "Super Admin"
                      }
                      case ROLE.ADMIN: {

                        return "Admin";
                      }
                     
                      case ROLE.VENDOR: {

                         return "Vendor"
                      }
                      case ROLE.VENDOR_AWAITING_APPROVAL: {

                         return "Vendor Awaiting Approval";
                      }
                      case ROLE.CUSTOMER: {

                          return "Customer";
                      }

                      default: {
                        return "Customer"
                      }
                  }
}