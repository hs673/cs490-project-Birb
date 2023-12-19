import request from 'supertest';
import app from '../server';

describe('Test API Endpoints', () => {
    var token;
    beforeAll(async () => {
        // Perform setup tasks, such as creating a clean test database
        // This may include creating sample data for testing
        
        //Creating a dummy user
        var userData = {
            username: "testuser@gmail.com", 
            password: "password", 
            fname: "fname", 
            lname: "lname", 
            pomodoro: {timer: 25, short: 5, long: 15},
        }
        var response = await request(app).post('/api/auth/register').send(userData).set('Content-Type', 'application/json');;
        // login in user to get a token
        userData = {
            username: "testuser@gmail.com", 
            password: "password", 
        }
        response = await request(app).post('/api/auth/login').send(userData).set('Content-Type', 'application/json');;

        token = response._body.token;
        console.log(token)
        //creating empty task containers
        await request(app).post('/api/tasks/').send({username: "testuser@gmail.com"})
    });
      //deleting the dummy user
    afterAll(async () => {
        // Perform teardown tasks, such as cleaning up the test database
        //delete created test user
        await request(app).delete('/api/user/testuser@gmail.com')
    });
      
    // Testing /api/auth and /api/user
    it('GET /api/user/ get err 400 when user not found ', async () => {
        const response = await request(app).get('/api/user/notAUser')
       // console.log(response)
        expect(response.status).toEqual(400)
    });

    it('POST /api/auth/register Create a new user', async () => {
        const userData = {
            username: "newuser@gmail.com", 
            password: "hashpassword", 
            fname: "fname", 
            lname: "lname", 
            pomodoro: {timer: 25, short: 5, long: 15},
        }
        const response = await request(app).post('/api/auth/register').send(userData).set('Content-Type', 'application/json');;
        //console.log(response)
        expect(response.status).toEqual(200)
        expect(response.text).toEqual("user created")
    });

    it('POST /api/auth/register Create a user with a used email', async () => {
        const userData = {
            username: "newuser@gmail.com", 
            password: "hashpassword", 
            fname: "fname", 
            lname: "lname", 
            pomodoro: {timer: 25, short: 5, long: 15},
        }
        const response = await request(app).post('/api/auth/register').send(userData).set('Content-Type', 'application/json');
       // console.log(response)
        expect(response.status).toEqual(400)
        expect(response.text).toEqual("{\"error\":\"Username already exists\"}")
    });

    it('GET /api/user/ get response 200 and appropriate content-type', async () => {
        const response = await request(app).get('/api/user/newuser@gmail.com')
       // console.log(response)
        expect(response.status).toEqual(200)
    });



    it('PUT /api/user/ Update user fname and lname', async () => {
        const userData = {
            username: "testuser@gmail.com",
            fname: "Guilherme", 
            lname: "Vilatoro", 
            pomodoro: {timer: 5, short: 2, long: 3},
        }
        var response = await request(app).put('/api/user/testuser@gmail.com').send(userData).set('Content-Type', 'application/json');
        expect(response.status).toEqual(200)
        //console.log(response)
        response = await request(app).get('/api/user/testuser@gmail.com')
        expect(response.status).toEqual(200)
        expect(response.body.fname).toEqual("Guilherme");
        expect(response.body.lname).toEqual("Vilatoro");
    });

    it('POST /api/auth/login Testing login', async () => {
        const userData = {
            username: "newuser@gmail.com", 
            password: "hashpassword", 
        }
        const response = await request(app).post('/api/auth/login').send(userData).set('Content-Type', 'application/json');;
        //console.log(response)
        expect(response.status).toEqual(200)
        expect(response._body.token);

    });

    it('POST /api/auth/login Testing login with user but wrong password', async () => {
        const userData = {
            username: "newuser@gmail.com", 
            password: "hash", 
        }
        const response = await request(app).post('/api/auth/login').send(userData).set('Content-Type', 'application/json');;
        //console.log(response)
        expect(response.status).toEqual(400)
        expect(response._body.error).toEqual("Invalid Password");
    });

    it('POST /api/auth/login Testing login with wrong user and password', async () => {
        const userData = {
            username: "newuser@", 
            password: "hash", 
        }
        const response = await request(app).post('/api/auth/login').send(userData).set('Content-Type', 'application/json');
        //console.log(response)
        expect(response.status).toEqual(404)
        expect(response._body.error).toEqual("Username does not exist");
    });

    it('DELETE /api/user/ delete newuser@gmail.com from DB', async () => {
        const response = await request(app).delete('/api/user/newuser@gmail.com')
       // console.log(response)
        expect(response.status).toEqual(200)
    });

    it('GET /api/user/ testing if the New User was deleted', async () => {
        const response = await request(app).get('/api/user/newuser@gmail.com')
        //console.log(response)
        expect(response.status).toEqual(400)
    });
    //---------------------------------------------------------------------
    //Testing the /api/task
    it('POST /api/tasks/ Creating tasks for dummy user', async () => {
        const data = {
            
            topTasks:[{dateAssigned: '14-November-2023',title: "Hw", description: "", priority: 'Important', pomodoroTimers:2, status:'NS'}],
            importantTasks:[{ dateAssigned: '14-November-2023' ,title: "Hw", description: "", priority: 'Important', pomodoroTimers:2, status:'NS'}],
            otherTasks:[{dateAssigned: '14-November-2023', title: "Hw", description: "", priority: 'Important', pomodoroTimers:2, status:'NS'}]
        }
        
        const response = await request(app).put('/api/tasks/testuser@gmail.com').send(data).set('Content-Type', 'application/json');
        //console.log(response)
        expect(response.status).toEqual(200)
    });

    it('POST /api/tasks/ Updating tasks for dummy user', async () => {
        const data = {
            topTasks:[{dateAssigned: '13-November-2023',title: "Hw", description: "", priority: 'Important', pomodoroTimers:2, status:'NS'}],
            importantTasks:[{ dateAssigned: '13-November-2023' ,title: "Hw", description: "", priority: 'Important', pomodoroTimers:2, status:'NS'}],
            otherTasks:[{dateAssigned: '13-November-2023', title: "Hw", description: "", priority: 'Important', pomodoroTimers:2, status:'NS'}]
        }
        
        await request(app).put('/api/tasks/testuser@gmail.com').send(data);
        const response = await request(app).get('/api/tasks/testuser@gmail.com')
        //console.log(response)
        expect(response.status).toEqual(200)
        expect(response._body.topTasks[0].dateAssigned).toEqual("13-November-2023")
        
    });


    it('POST /api/appointments/ Creating appointments for dummy user', async () => {
        const data = {
            username:"testuser@gmail.com"
        }
        await request(app).post('/api/appointments/').send(data).set('Content-Type', 'application/json')
        const response = await request(app).get('/api/appointments/testuser@gmail.com')
        //console.log(response)
        //console.log(response2)
        expect(response.status).toEqual(200)
        expect(response._body.date).toEqual("10-December-2010")
        
    });


    it('PUT /api/appointments/ Updating appointments for dummy user', async () => {
        const data = {
            username:"testuser@gmail.com",
            date:"20-December-2023",
            isPlanned:true,
        }
        const response2 = await request(app).put('/api/appointments/testuser@gmail.com').send(data)
        const response = await request(app).get('/api/appointments/testuser@gmail.com')
        //console.log(response)
        //console.log(response2)
        expect(response.status).toEqual(200)
        expect(response._body.date).toEqual("20-December-2023")
        
    });

    it('PUT /api/appointments/ Updating appointments for dummy user', async () => {
        const data = {
            username:"testuser@gmail.com",
            date:"10-December-2010",
            isPlanned:true,
        }
        const response2 = await request(app).put('/api/appointments/testuser@gmail.com').send(data)
        const response = await request(app).get('/api/appointments/testuser@gmail.com')
        //console.log(response)
        //console.log(response2)
        expect(response.status).toEqual(200)
        expect(response._body.date).toEqual("10-December-2010")
        
    });

    it('POST /api/pic/ Create Pic container', async () => {
        const data = {
            username:"testuser@gmail.com",
        }
        await request(app).post('/api/pic/').send(data).set('Content-Type', 'application/json')
        const response = await request(app).get('/api/pic/testuser@gmail.com')
        //console.log(response)
        //console.log(response2)
        expect(response.status).toEqual(200)
        expect(response._body.username).toEqual("testuser@gmail.com")
        
    });

    it('POST /api/pic/ Uploading picture', async () => {
        const data = {
            username:"testuser@gmail.com",
            selectedFile:"pau_de_jumento"
        }
        const response2 = await request(app).put('/api/pic/testuser@gmail.com').send(data).set('Content-Type', 'application/json')
        const response = await request(app).get('/api/pic/testuser@gmail.com')
        //console.log(response)
        //console.log(response2)
        expect(response.status).toEqual(200)
        expect(response._body.picture).toEqual("pau_de_jumento")
        
    });

    it('POST /api/pic/ Uploading picture', async () => {
        const data = {
            username:"testuser@gmail.com",
            selectedFile:null
        }
        const response2 = await request(app).put('/api/pic/testuser@gmail.com').send(data).set('Content-Type', 'application/json')
        const response = await request(app).get('/api/pic/testuser@gmail.com')
        //console.log(response)
        //console.log(response2)
        expect(response.status).toEqual(200)
        expect(response._body.picture).toEqual("null")
        
    });

    it('POST /api/pic/ Uploading picture', async () => {
        const data = {
            username:"testuser@gmail.com",
            selectedFile:null
        }
        const response2 = await request(app).put('/api/pic/testuser@gmail.com').send(data).set('Content-Type', 'application/json')
        const response = await request(app).get('/api/pic/testuser@gmail.com')
        //console.log(response)
        //console.log(response2)
        expect(response.status).toEqual(200)
        expect(response._body.picture).toEqual("null")
        
    });

    it('POST /api/pic/ Uploading picture', async () => {
        const data = {
            username:"testuser@gmail.com",
            selectedFile:null
        }
        const response2 = await request(app).put('/api/pic/testuser@gmail.com').send(data).set('Content-Type', 'application/json')
        const response = await request(app).get('/api/pic/testuser@gmail.com')
        //console.log(response)
        //console.log(response2)
        expect(response.status).toEqual(200)
        expect(response._body.picture).toEqual("null")
        
    });
    

    it('POST /api/task/ Delete tasks for dummy user', async () => {
        await request(app).delete('/api/user/testuser@gmail.com')
        const response = await request(app).get('/api/user/testuser@gmail.com')
        expect(response.status).toEqual(400)
    });

 });