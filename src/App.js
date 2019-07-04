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
    editMemberData : {
      id:'',
      name: '',
      age: ''
    },

    NewMemberModal : false,
    editMemberModal: false
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
  toggleEditMemberModal(){
    this.setState({
      editMemberModal :! this.state.editMemberModal
    })
  }

  addMember(){
    axios.post("http://api1.zapote.se/people",this.state.newMemberData).then((response) =>{
    let {people} = this.state;
    people.push(response.data);
    this.setState({people,NewMemberModal : false,newMemberData : {
      name: '',
      age: ''
    }})
  })
  }
  updateMember(){
    let {name,age} = this.state.editMemberData
    axios.put("http://api1.zapote.se/people" + this.state.editMemberData.id, {
      name,age
    }).then((response) => {
      console.log(response.data)
    })

  }
  editMember(id,name,age){
    this.setState({
      editMemberData :{id,name,age},editMemberModal :! this.state.editMemberModal
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
                <Button color='success' size='sm' className='mr-2'onClick ={this.editMember.bind(this,person.id,person.name,person.age)}>Edit</Button>
                <Button color='danger' size='sm' >Delete</Button>
              </td>
            </tr>
     )
    })
    return (
      <div className="App container">
        <h1>CRUD Operations App</h1>
        <Button className ='my-4' color="primary" onClick={this.toggleNewMemberModal.bind(this)}> Add New Member</Button>
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
           newMemberData.age = Number(e.target.value);
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
        <Modal isOpen={this.state.editMemberModal} toggle={this.toggleEditMemberModal.bind(this)}>
          <ModalHeader toggle={this.toggleEditMemberModal.bind(this)}>Edit Member</ModalHeader>
          <ModalBody>
          <FormGroup>
          <Label for="name" >Name</Label>
          <Input id="name" value ={this.state.editMemberData.name} onChange= {(e)=>{
           let {editMemberData} = this.state;
           editMemberData.name = e.target.value;
           this.setState({editMemberData})
          }} />
        </FormGroup>
        <FormGroup>
          <Label for="age" >Age</Label>
          <Input id="age" value ={this.state.editMemberData.age} onChange= {(e)=>{
           let {editMemberData} = this.state;
           editMemberData.age = Number(e.target.value);
           this.setState({editMemberData})
          }}  
          />
        </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={this.updateMember.bind(this)}>Update member</Button>{' '}
            <Button color="secondary" onClick={this.toggleEditMemberModal.bind(this)}>Cancel</Button>
          </ModalFooter>
        </Modal>

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
          {member}
          </tbody>
        </Table>
      </div>
    );
  }
}

export default App;
