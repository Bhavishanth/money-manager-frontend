import React, { useState, useEffect } from "react";
import { Modal, Form, Select, Input, message, Table, DatePicker } from 'antd';
import axios from 'axios';
import Layout from "../components/Layout/Layout";
import moment from "moment";
const { RangePicker } = DatePicker;




const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [allTransection, setAllTransection] = useState([]);
  const [frequency, setFrequency] = useState('7');
  const [selectedDate, setSelectedate] = useState([]);
  const [type, setType] = useState('all');
  const [category, setCat] = useState('fuel');
  const [division, setDiv] = useState('personal');

  const columns = [
    {
      title : 'Type',
      dataIndex : 'type'
    },
    {
      title : 'Date',
      dataIndex : 'date',
      render : (text) => <span>{moment(text).format('YYYY-MM-DD')}</span>
    },
    {
      title : 'Amount',
      dataIndex : 'amount'
    },
    {
      title : 'Division',
      dataIndex : 'division'
    },
    {
      title : 'Category',
      dataIndex : 'category'
    },
    {
      title : 'Description',
      dataIndex : 'description'
    }

  ]

  const getAllTransactions = async () => {

    try {
      
      const user = JSON.parse(localStorage.getItem('user'))
      const res = await axios.post('/transections/get-transection', { frequency, selectedDate, type, category, division} )
      setAllTransection(res.data)
      console.log(res.data)
    }
    catch (error) {
      console.log(error);
      message.error("Fetch issue with the transaction")
    }

  };

    useEffect(() => {

      getAllTransactions()
    }, [frequency, selectedDate]);
    

  const handleSubmit = async (values) => {

    try {

      const user = JSON.parse(localStorage.getItem('user'))
      
      await axios.post('/transections/add-transection', {...values})
      
      message.success('Transaction Added Successfully')
      setShowModal(false)
  
    }
    catch (error) {
      
      message.error('Failed to add transection')
      console.log(error);


    }
  }

  return (
    <Layout>
      
      <div className="filters">
        <div>
          <h6>Select frequency</h6>
          <Select value ={frequency} onChange={(values) => setFrequency(values)}>
            <Select.Option value = "7">Last 1 Week</Select.Option>
            <Select.Option value = "30">Last 1 Month</Select.Option>
            <Select.Option value ="365">Last 1 Year</Select.Option>
            <Select.Option value = "custom">Custom</Select.Option>
          </Select>
          {frequency === 'custom' && (
          <RangePicker value={selectedDate} 
          onChange={(values) => setSelectedate(values)} />
          )}
        </div>
        <div>
          <h6>Select Type</h6>
          <Select value ={type} onChange={(values) => setType(values)}>
            <Select.Option value = "all">ALL</Select.Option>
            <Select.Option value = "income">INCOME</Select.Option>
            <Select.Option value ="expense">EXPENSE</Select.Option>
          </Select>
        </div>

        <div>
          <h6>Select Division</h6>
          <Select value ={division} onChange={(values) => setDiv(values)}>
            <Select.Option value = "Office">OFFICE</Select.Option>
            <Select.Option value = "Personal">PERSONAL</Select.Option>
          </Select>
        </div>

        <div>
          <h6>Select Category</h6>
          <Select value ={category} onChange={(values) => setCat(values)}>
            <Select.Option value = "Fuel">FUEL</Select.Option>
            <Select.Option value = "Movie">MOVIE</Select.Option>
            <Select.Option value ="Food">FOOD</Select.Option>
            <Select.Option value ="Loan">LOAN</Select.Option>
            <Select.Option value ="Medical">MEDICAL</Select.Option>
          </Select>
        </div>

        <div>
        <button className="btn btn-primary" onClick={ () => setShowModal(true)}>Add New</button>
        </div>
        </div>
        <div className="content">
          <Table columns={columns} dataSource={allTransection}/>
        </div>
        <Modal title = "Add Transaction" 
        open = {showModal} 
        onCancel = { () => setShowModal(false)}
        footer = {false}
        >
          <Form layout = "vertical" onFinish = {handleSubmit}>
          <Form.Item label = "Userid" name="userid">
              <Input type="text" />
            </Form.Item>

            <Form.Item label = "Amount" name="amount">
              <Input type="text" />
            </Form.Item>

            <Form.Item label = "Type" name="type">
              <Select>
                <Select.Option value = "income">Income</Select.Option>
                <Select.Option value = "expense">Expense</Select.Option>
              </Select>
              </Form.Item>

              <Form.Item label = "Division" name="division">
              <Select>
                <Select.Option value = "Office">Office</Select.Option>
                <Select.Option value = "Personal">Personal</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label = "Category" name="category">
              <Select>
                <Select.Option value = "Fuel">Fuel</Select.Option>
                <Select.Option value = "Movie">Movie</Select.Option>
                <Select.Option value = "Food">Food</Select.Option>
                <Select.Option value = "Loan">Loan</Select.Option>
                <Select.Option value = "Medical">Medical</Select.Option>     
              </Select>
            </Form.Item>
          <Form.Item label = "Date" name = "date">
            <Input type = "date" />
          </Form.Item>

          <Form.Item label = "Description" name = "description">
            <Input type = "text" />
            </Form.Item>

          <div className="d-flex justify-content-end">
            <button type ="submit"className="btn btn-primary">SAVE</button>
          </div>
          </Form>
        </Modal>
    </Layout>
  );
};

export default HomePage;