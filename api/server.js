// server.js
require('dotenv').config()
const fastify = require('fastify')({ logger: true })

fastify.register(require('@fastify/postgres'), {
  connectionString: process.env.DATABASE_URL
})


// ------------------------------------------------
// READ ALL (GET /users)
// ------------------------------------------------
fastify.get('/users', async (req, reply) => {
  const client = await fastify.pg.connect()
  try {
    const { rows } = await client.query('SELECT * FROM users ORDER BY id')
    return rows
  } finally {
    client.release()
  }
})


// ------------------------------------------------
// READ ONE (GET /users/:id)
// ------------------------------------------------
fastify.get('/users/:id', async (req, reply) => {
  const { id } = req.params
  const client = await fastify.pg.connect()
  try {
    const { rows } = await client.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    )
    if (rows.length === 0) return reply.code(404).send({ message: 'User not found' })
    return rows[0]
  } finally {
    client.release()
  }
})


// ------------------------------------------------
// CREATE (POST /users)
// ------------------------------------------------
fastify.post('/users', async (req, reply) => {
  const { username } = req.body
  if (!username) {
    return reply.code(400).send({ message: 'username is required' })
  }

  const client = await fastify.pg.connect()
  try {
    const { rows } = await client.query(
      'INSERT INTO users (username) VALUES ($1) RETURNING *',
      [username]
    )
    return reply.code(201).send(rows[0])
  } finally {
    client.release()
  }
})


// ------------------------------------------------
// UPDATE (PUT /users/:id)
// ------------------------------------------------
fastify.put('/users/:id', async (req, reply) => {
  const { id } = req.params
  const { username } = req.body

  if (!username) {
    return reply.code(400).send({ message: 'username is required' })
  }

  const client = await fastify.pg.connect()
  try {
    const { rows } = await client.query(
      'UPDATE users SET username = $1 WHERE id = $2 RETURNING *',
      [username, id]
    )
    if (rows.length === 0) return reply.code(404).send({ message: 'User not found' })
    return rows[0]
  } finally {
    client.release()
  }
})


// ------------------------------------------------
// DELETE (DELETE /users/:id)
// ------------------------------------------------
fastify.delete('/users/:id', async (req, reply) => {
  const { id } = req.params

  const client = await fastify.pg.connect()
  try {
    const { rows } = await client.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    )
    if (rows.length === 0) return reply.code(404).send({ message: 'User not found' })
    return { message: 'User deleted' }
  } finally {
    client.release()
  }
})


// ------------------------------------------------
// Start server
// ------------------------------------------------
fastify.listen({ port: 3000, host: '0.0.0.0' })
  .then(() => console.log('API server running'))
  .catch(err => console.error(err))

