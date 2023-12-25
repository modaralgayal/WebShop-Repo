import app from '../index'
import mongoose from 'mongoose'
import supertest from 'supertest'

const api = supertest(app)

beforeEach(async () => {
  const login = await api
    .post('/auth/login')
    .send({
      email: 'bigshaq@gmail.com',
      password: '1212'
    })
    // console.log(login.headers)
})

test('Getting User Successful', async () => {
  const res = await api.get('/users')
  // console.log("headers are", res.headers)
  expect(res.status).toBe(200)
})

afterAll(async () => {
  await mongoose.connection.close()
})
