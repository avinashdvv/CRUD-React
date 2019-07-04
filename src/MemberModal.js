import React from 'react';

import { 
  Label,
  Input,
  Modal,
  Button,
  Spinner,
  ModalBody,
  FormGroup,
  ModalHeader,
  ModalFooter,
} from "reactstrap";


export default ({ 
  isEdit, 
  isLoading, 
  memberData, 
  handleInput, 
  handelMemberData,
  isMemberModalOpen, 
  toggleMemberModal, 
}) => {
  
  let btnText = isEdit ? 'Update' : 'Add';

  if (isLoading && isEdit) {
    btnText =  <Spinner size="sm" color="primary" />
  }

  if (isLoading && !isEdit) {
    btnText = <Spinner size="sm" color="success" />
  }

  return (
    <Modal isOpen={isMemberModalOpen} toggle={toggleMemberModal}>
      <ModalHeader toggle={toggleMemberModal}>
        {isEdit ? 'Update Member' : 'Add Member'}
      </ModalHeader>

      <ModalBody>
        <FormGroup>
          <Label for="name"> Name </Label>
          <Input id="name" type="name" value={memberData.name} onChange={handleInput('name')} />
        </FormGroup>
  
        <FormGroup>
          <Label for="age"> Age </Label>
          <Input id="age" type="number" value= {memberData.age} onChange={handleInput('age')} />
        </FormGroup>
      </ModalBody>
      
      <ModalFooter>
        <Button color="secondary" onClick={toggleMemberModal}>Cancel</Button>

        <Button color={isEdit ? 'primary' : 'success'} disabled={isLoading} onClick={handelMemberData(memberData)}>
          {btnText}
        </Button>
      </ModalFooter>
    </Modal>
)};