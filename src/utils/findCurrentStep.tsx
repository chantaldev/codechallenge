import { AddFormRoutes } from '@/types';

const steps = [
    {
      title: 'Business Structure',
      route: 'step-1',
      link: AddFormRoutes.BUSINESS_STRUCTURE,
    },
    {
      title: 'Contact Person',
      route: 'step-2',
      link: AddFormRoutes.CONTACT_INFO,
    },
    {
      title: 'Review & Submit',
      route: 'step-3',
      link: AddFormRoutes.REVIEW_SUBMIT,
    },
  ];

  export const findCurrentStep = (path) => {
    return steps.find(s => path.includes(s.route));
  };