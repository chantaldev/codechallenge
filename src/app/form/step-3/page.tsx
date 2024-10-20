"use client";
import { FormContainer, EditLink, AddressContainer, P, InputWrapper, Container3 } from '../../../components/styles_components';
import Button from '../../../components/Button';
import { useFormContext } from '../../../context/formContext';
import { sendFormData } from '../../../services/companyService';
import ShowConfirmation from '../../../components/ShowConfirmation';
import { statusOptions } from '../../../constants/staticOptions';
import { useRouter } from 'next/navigation';
import { AddFormRoutes } from '../../../types';

const Form3 = () => {
  const router = useRouter();
  const {
    newCompanyData,
    setStatus,
    hide, setHide,
    setFormCompleted,
    showConfirmation, setShowConfirmation,
    apiMessage, setApiMessage,
    setLoading,
    success, setSuccess,
    buttonText, setButtonText,
    resetLocalStorage,
    setCurrentStep,
    setCompletedStepIndex,
    setErrors,
  } = useFormContext();

  const handleEditClick = (step: string) => {
    router.push(`/form/${step}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name: newCompanyData.companyName,
      type: newCompanyData.companyType,
      address: {
        line1: newCompanyData.address1,
        line2: newCompanyData.address2,
        city: newCompanyData.city,
        state: newCompanyData.state,
        zip: newCompanyData.zip,
      },
      contact: {
        firstName: newCompanyData.firstName,
        lastName: newCompanyData.lastName,
        email: newCompanyData.email,
      },
    };

    if (buttonText === 'Start over') {
      setShowConfirmation(false);
      setFormCompleted(false);
      setStatus({ text: '', variant: '' });
      setHide(true);
      setCompletedStepIndex(-1);
      setCurrentStep('step-1');
      setErrors({
        companyName: '',
        companyType: '',
        address1: '',
        city: '',
        state: '',
        zip: '',
      });
      router.push(AddFormRoutes.BUSINESS_STRUCTURE);
      resetLocalStorage();
      setLoading(false);
      return;
    }

    try {
      const result = await sendFormData(payload);
      const isSuccess = result.success;

      if (isSuccess) {
        setStatus({ text: statusOptions[1].status, variant: statusOptions[1].variant }); // "Success"
        setApiMessage(result.message);
        setSuccess(true);
        setButtonText("Start over");
        setHide(true);
        setFormCompleted(true);
      } else {
        setStatus({ text: statusOptions[2].status, variant: statusOptions[2].variant }); // "Error"
        setApiMessage(result.message);
        setSuccess(false);
      }
    } catch (error) {
      setStatus({ text: statusOptions[2].status, variant: statusOptions[2].variant }); // "Error"
      console.error('Error al enviar el formulario:', error);
      setApiMessage('Hubo un error al enviar el formulario.');
      setSuccess(false);
    } finally {
      setLoading(false);
      setShowConfirmation(true);
    }
  };

  return (
    <Container3>
      <FormContainer>
        <div style={{ marginBottom: '30px' }}>
          <p className='category'>
            <span>Business Structure</span>
            {!hide && (
              <EditLink onClick={() => handleEditClick('step-1')}>Edit</EditLink>
            )}
          </p>
          <p className='info1'>Name: <span className='info2 name'>{newCompanyData.companyName}</span></p>
          <p className='info1'>Address:
            <span className='info2'>{newCompanyData.address1} <br />
              <span className='info3'>{newCompanyData.address2} <br />
                <span className='info3'>{newCompanyData.state}, {newCompanyData.zip}</span>
              </span>
            </span>
          </p>
        </div>

        <div>
          <p className='category'>
            <span>Contact Info</span>
            {!hide && (
              <EditLink onClick={() => handleEditClick('step-2')}>Edit</EditLink>
            )}
          </p>
          <p className='info1 name'>Name:
            <span className='info2'>{newCompanyData.firstName} {newCompanyData.lastName}</span></p>
          <p className='info1'>Email:<span className='info2'>{newCompanyData.email}</span></p>
          <p className='info1'> Phone:
            <span className='info2'>{newCompanyData.phone}</span></p>
        </div>

       
          <Button type="submit" onClick={handleSubmit}>{buttonText}</Button>
      

        {showConfirmation && (
          <ShowConfirmation success={success} message={apiMessage} />
        )}
      </FormContainer>
    </Container3>
  );
};

export default Form3;
