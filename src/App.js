import React, { Component } from "react";
import "./App.css";
import {FormGroup,Label,Input, Modal,ModalBody,ModalHeader,ModalFooter, Table, Button } from "reactstrap";
import axios from 'axios'

class App extends Component {
  state = {
    people: [],
    newMemberData : {
      name: '',
      age: ''
    },
    NewMemberModal : false

  };
  componentWillMount() {
    axios.get("http://api1.zapote.se/people")
      .then(response =>
        {this.setState (
          {
            people:response.data
          }
        )})
  }
  toggleNewMemberModal(){
    this.setState({
      NewMemberModal :! this.state.NewMemberModal
    })
  }
  addMember(){
    axios.post("http://api1.zapote.se/people",this.state.newMemberData).then((response) =>{
    console.log(response.data)
  })
  }
  render() {
    let member = this.state.people.map(person => {
     return(
      <tr key={person.id}>
              <td>{person.id}</td>
              <td>{person.name}</td>
              <td>{person.age}</td>
              <td>
                <Button color='success' size='sm' className='mr-2'>Edit</Button>
                <Button color='danger' size='sm' >Delete</Button>
              </td>
            </tr>
     )
    })
    return (
      <div className="App container">
        <Button color="primary" onClick={this.toggleNewMemberModal.bind(this)}> Add New Member</Button>
        <Modal isOpen={this.state.NewMemberModal} toggle={this.toggleNewMemberModal.bind(this)}>
          <ModalHeader toggle={this.toggleNewMemberModal.bind(this)}>Add Member</ModalHeader>
          <ModalBody>
          <FormGroup>
          <Label for="name" >Name</Label>
          <Input id="name" value ={this.state.newMemberData.name} onChange= {(e)=>{
           let {newMemberData} = this.state;
           newMemberData.name = e.target.value;
           this.setState({newMemberData})
          }} />
        </FormGroup>
        <FormGroup>
          <Label for="age" >Age</Label>
          <Input id="age" value ={this.state.newMemberData.age} onChange= {(e)=>{
           let {newMemberData} = this.state;
           newMemberData.age = e.target.value;
           this.setState({newMemberData})
          }}  
          />
        </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.addMember.bind(this)}>Add member</Button>{' '}
            <Button color="secondary" onClick={this.toggleNewMemberModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>

        <Table>
          <thead>
            <tr>
              <th># </th>
              <th>Name</th>
              <th>Age </th>
              <th>Actions </th>
            </tr>
          </thead>
          <tbody>
          {member}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
