import { ApiV1 } from 'helper/api';

export default {
    getAllMembershipTypesMaster(data) {
        return ApiV1.get('services/app/MemberShip/GetAllMemberShipTypesMaster', {
            params: data
        });
    },
    CreateMembership(payload) {
        return ApiV1.post(`services/app/MemberShip/CreateMemberShip`, payload);
    },
    CreateMembershipInvoice(payload) {
        return ApiV1.post(
            `services/app/MemberShip/CreateMemberShipInvoice?memberShipId=${payload.memberShipId}&companyId=${payload.companyId}`
        );
    },
    getCompanyMembershipById(id) {
        return ApiV1.get(`services/app/MemberShip/GetByCompanyId?companyId=${id}`);
    },
    getCompanyMembershipInvoicesById(id) {
        return ApiV1.get(`services/app/MemberShip/GetInvoicesByCompanyId?companyId=${id}`);
    },
    getAllInactiveMembershipForAdmin() {
        return ApiV1.get(`services/app/MemberShip/GetAllInActiveMemberShipsForAdmin`);
    },
    getAllActiveMembershipForAdmin() {
        return ApiV1.get(`services/app/MemberShip/GetAllActiveMemberShipsForAdmin`);
    },
    markAspaid(iId,isPaid){
        return ApiV1.post(`services/app/MemberShip/MarkInvoicePaid?invoiceId=${iId}&isPaid=${isPaid}`)
    }
};
