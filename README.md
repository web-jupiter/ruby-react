# React Material
React project using Material-UI React library.

## Part 1: Create a Login Component
1.Download the repository, install and run the project to verify it works:


```javascript
npm install
npm start
```

2. Add the Material-UI dependencies to the package.json file and re-run the install module command.

```javascript
   "@material-ui/core": "^3.0.1",
    "@material-ui/icons": "^3.0.1",
```

3. Create a new folder called component and add a Login.js and Login.css files with the following code:

```javascript
import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import './Login.css'


export class Login extends React.Component{

    render(){
        return (
            <React.Fragment>
                <CssBaseline />
                <main className="layout">
                    <Paper className="paper">
                        <Avatar className="avatar">
                            <LockIcon />
                        </Avatar>
                        <Typography variant="headline">Sign in</Typography>
                        <form className="form">
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="email">Email Address</InputLabel>
                                <Input id="email" name="email" autoComplete="email" autoFocus />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input
                                    name="password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                variant="raised"
                                color="primary"
                                className="submit"
                            >
                                Sign in
                            </Button>
                        </form>
                    </Paper>
                </main>
            </React.Fragment>
        );
    }

}




```

```css
.layout {
    width: 60%;
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.paper {
    margin-top: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
}

.avatar {
    margin: 10px;
    background: floralwhite;
}

.form {
    width: 100%;
    margin-top: 30px;
}

.submit {
    marginTop: 20px;
}

```

4. Add the Login component to the App.js render method to test your login component.


## Part 2: Enable App Navigation 

1. Refactor your App.js: 
    * Create a new file called TodoApp and extract all the Todo logic into this file.
    * Change the Todo components to use react Material components: Button, TextField, Card and DatePickers.

2. Add the react-router-dom component to your package.json file and install it:

```javascript
   "react-router-dom": "^4.3.1"   
```

```javascript
   npm install
```
        
3. Create a constant for each View (Login and TodoApp) in the App.js file:

```javascript
  const LoginView = () => (
      <Login/>
  );
  
  const About = () => (
      <div>
          <NavBar/>
          <CoursesList/>
      </div>
  );
```

4. Import the following Components in the App.js file:

```javascript
import {BrowserRouter as Router, Link, Route} from 'react-router-dom'
```

5. Add the following code to render method on the App.js:

```javascript

    render() {

        return (
            <Router>
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>
                        <h1 className="App-title">TODO React App</h1>
                    </header>

                    <br/>
                    <br/>

                    <ul>
                        <li><Link to="/">Login</Link></li>
                        <li><Link to="/todo">Todo</Link></li>
                    </ul>

                    <div>
                        <Route exact path="/" component={LoginView}/>
                        <Route path="/todo" component={TodoView}/>
                    </div>
                </div>
            </Router>
        );
    }
```

6. Run the application and test that the navigation works.

7. Read the React Route Training documentation and understand about the BrowserRouter Component:
https://reacttraining.com/react-router/web/example/basic


8. Add a state *isLoggedIn* to the App.js Component to know when what view to display.

9. Set the default value of *isLoggedIn* to false and then add an if condition inside the render method that renders the correct view.


## Part 3: Local Storage

In order to create Web applications that work offline we can use the local storage. You can use it directly on your js files as follows:

```javascript

//Save data
localStorage.setItem('key', value);

//Read data
localStorage.getItem('key');

````
  
1. Use the local storage to store a default user (username and password).

2. Add the click handler to Sign In button in order to verify that the user exists (use the one saved on the *localStorage*)

3. Once the user is authenticated successfully then store the *isLoggedIn* on the storage and add the logic to make sure this value is set to state everytime the application is loaded.
This will prevent the user authentication every time!

4. Run the application and then stop the server and verify the data is persisted.

Tip: You can use the Google Chrome Developer tools under the Application tab to explore the Local Storage. 
   