import { create } from 'zustand';

const usePartnerStore = create((set) => ({
    partnerId: null,
    partnerName: null,
    setPartnerInfo: ({id, name}) => set({ partnerId: id, partnerName: name }),
    resetPartner: () => set({ partnerId: null, partnerName: null }),
}));

export default usePartnerStore; 