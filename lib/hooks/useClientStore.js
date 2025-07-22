import { useEffect, useState } from 'react';
import { useDoctorStore } from '@/store/doctorStore';

export function useClientDoctorStore() {
  const [isClient, setIsClient] = useState(false);
  const store = useDoctorStore();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Return safe values that won't cause SSR issues
  return {
    ...store,
    name: isClient ? store.name : '',
    email: isClient ? store.email : '',
    specialization: isClient ? store.specialization : '',
    image: isClient ? store.image : '',
    doctorData: isClient ? store : {
      _id: '',
      name: '',
      email: '',
      specialization: '',
      image: '',
      phone: '',
      address: '',
      experience: 0,
      price: 0,
      status: 'pending',
      availability: [],
      services: [],
      about: '',
      degree: '',
      hospital: '',
      slots: {},
      virtualConsultation: false,
      inPersonConsultation: false,
      hasWebsite: false,
      websiteUrl: null,
      createdAt: '',
      updatedAt: '',
    },
    isClient,
  };
} 