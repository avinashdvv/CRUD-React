import React from "react";
import axios from 'axios'

import { Table, Button, Spinner } from "reactstrap";

import MemberModal from './MemberModal';

import "./App.css";

export default class App extends React.Component {
  state = {
    people: [],
    isLoading: true,
    memberData: {
      id: null,
      name: null,
      age: null
    },
    isEditMember: false,
    isMemberModalOpen: false,
    isAddOrEditMemberUpdating: false
  };

  componentWillMount() {
    this.fetchMembers();
  }

  toggleMemberModal = isEditMember => {
    this.setState({
      isEditMember,
      isMemberModalOpen : !this.state.isMemberModalOpen,
      memberData: !this.state.isMemberModalOpen ? { } : this.state.memberData,
    });
  }

  addMember = () => {
    this.setState({
      isAddOrEditMemberUpdating: true,
    });

    const { name, age } = this.state.memberData;

    axios.post("http://api1.zapote.se/people", { name, age: Number(age) }).then(response =>{
      let { people } = this.state;
      people.push(response.data);
      
      this.setState({ 
        people, 
        memberData: {},
        isMemberModalOpen: false,
        isAddOrEditMemberUpdating: false
      });
    })
  }
  
  updateMember = () => {
    let { name, age, id } = this.state.memberData;

    this.setState({
      isAddOrEditMemberUpdating: true
    });

    axios.put(`http://api1.zapote.se/people/${id}`, {
      name, age: Number(age)
    }).then(response => {
      
      this.setState({
        memberData: {},
        people: this.state.people.map(person =>  {
          if (person.id === response.data.id) return response.data;

          return person
        }),
        isMemberModalOpen: false,
        isAddOrEditMemberUpdating: false
      })
    });
  }
  
  editMember = personData => () => {
    this.setState({
      memberData: personData,
      isMemberModalOpen: true,
      isEditMember: true
    });
  }
  
  deleteMember = id => () => {
    this.setState({
      currentlyDeletingId: id
    });

    axios.delete("http://api1.zapote.se/people/" + id).then(response => {
      this.setState({
        people: this.state.people.filter(person => person.id !== id),
        currentlyDeletingId: null
      });
    });
  }

  fetchMembers = () => {
    this.setState({
      isLoading: true
    });

    axios.get("http://api1.zapote.se/people").then(response => {
      this.setState ({
        people:response.data,
        isLoading: false
      });
    });
  }

  handleInput = type => e => {
    let { memberData } = this.state;

    memberData[type] = e.target.value;
    
    this.setState({ memberData })
  }

  handelMemberData = memberData => () => {
    if (this.state.isEditMember) {
      return this.updateMember();
    }

    return this.addMember();
  }

  render() {
    const {
      isLoading,
      memberData,
      isEditMember,
      isMemberModalOpen,
      currentlyDeletingId,
      isAddOrEditMemberUpdating
    } = this.state;

    const membersList = !isLoading && this.state.people.map(person => {
      return(
        <Member
          key={person.id} // Here id is unique
          person={person}
          editMember={this.editMember}
          deleteMember={this.deleteMember}
          currentlyDeletingId={currentlyDeletingId}
        />
      );
    });

    return (
      <div className="App container">
        <h1>CRUD Operations App</h1>
        <Button 
          className ='my-4' 
          color="primary" 
          onClick={() => this.toggleMemberModal(false)}
        >
          Add New Member
        </Button>
       
       {isLoading ? (<h1> Loading...</h1>) : (
        <Table>
          <thead>
            <tr>
              <th>Id </th>
              <th>Name</th>
              <th>Age </th>
              <th>Actions </th>
            </tr>
          </thead>
          <tbody>
          {membersList}
          </tbody>
        </Table>
       )}
        

        <MemberModal 
          isEdit={isEditMember}
          memberData={memberData}
          handleInput={this.handleInput}
          isLoading={isAddOrEditMemberUpdating}
          isMemberModalOpen={isMemberModalOpen}
          handelMemberData={this.handelMemberData}
          toggleMemberModal={this.toggleMemberModal}
        />
      </div>
    );
  }
}

const Member = ({ person, editMember, deleteMember, currentlyDeletingId }) => (
  <tr key={person.id}>
    <td>{person.id}</td>
    <td>{person.name}</td>
    <td>{person.age}</td>
    <td>
      <Button 
        size='sm' 
        color='success' 
        className='mr-2'
        onClick={editMember(person)}
        disabled={currentlyDeletingId === person.id}
      >
        Edit
      </Button>
      <Button 
        size='sm'
        color='danger' 
        onClick={deleteMember(person.id)}
        disabled={currentlyDeletingId === person.id}
      >
        {currentlyDeletingId === person.id ? <Spinner size="sm" color="light" /> : 'Delete'}
      </Button>
    </td>
  </tr>
);
