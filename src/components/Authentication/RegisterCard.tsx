import React, { Component } from 'react';

class RegisterCard extends Component<Reactory.IReactoryComponentProps, any> {

  constructor(props, context) {
    super(props);

    const { reactory } = props;

    const queryParams = reactory.queryString.parse(props.location.search)
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      passwordConfirm: '',
      organizationId: queryParams.oid || null,
      organizationName: queryParams.onm || null
    };
    this.doLogin = this.doLogin.bind(this);
    this.doRegister = this.doRegister.bind(this);
    this.updateFirstname = this.updateFirstname.bind(this);
    this.updateLastname = this.updateLastname.bind(this);
    this.updateEmail = this.updateEmail.bind(this);    
    this.updatePassword = this.updatePassword.bind(this);
    this.updatePasswordConfirm = this.updatePasswordConfirm.bind(this);
    this.updateOrganizationName = this.updateOrganizationName.bind(this);
    this.formValid = this.formValid.bind(this);
  }

  static styles = (theme): any => ({
    root: {
      maxWidth: '600px',
      minWidth: '320px',
      padding: theme.spacing(1),
      textAlign: 'center',
    },
    logo: {
      display: 'block',
      height: '200px',
      margin: 0,
      padding: 0,
      background: `url(${theme.assets.logo || '//placehold.it/200x200'})`,
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
      marginRight: '0px',
      width: 'auto',
    }
  });

  componentDidMount(){
    const that = this;
    const { nilStr } = this.props.reactory.utils;

    if(!nilStr(this.state.organizationId)){
      this.props.api.companyWithId(this.state.organizationId).then((searchResult) => {
        if(!nilStr(searchResult.name)) that.setState({ organizationName: searchResult.name })
      }).catch((error) => {
        console.error('Could not lookup company', error);
      })
    }
  }
  
  doLogin = () => {
    const { history } = this.props;
    const { email, password } = this.state;
    this.props.api.login(email, password)
    .then((response) => response.json())
    .then((response)=>{
      localStorage.setItem('auth_token', response.user.token);
      history.push('/admin')
    }).catch((error) => {
      //could not login user
    })
  }

  doRegister = () => {
    const { email, password, firstName, lastName } = this.state;
    const that = this;
    const payload = { 
      user: { 
        email,
        password,
        firstName,
        lastName,
      },
      organization: {
        id: this.state.organizationId,
        name: this.state.organizationName
      }
    };
    
    this.props.api.register(payload).then(( registerResult) => {
      //console.log('Register Complete', registerResult)
      that.doLogin();
    }).catch((registerError) => {
      console.error('Register Error', registerError)
      that.setState({ registerError })
    })
  }
  

  updateFirstname = (evt) => this.setState({firstName: evt.target.value})
  updateLastname = (evt) => this.setState({lastName: evt.target.value})
  updateEmail = (evt) => this.setState({email: evt.target.value})  
  updatePassword = (evt) => this.setState({password: evt.target.value})
  updatePasswordConfirm = (evt) => this.setState({passwordConfirm: evt.target.value})
  updateOrganizationName = (evt) => this.setState({organizationName: evt.target.value})

  formValid = () => {
    const { 
      firstName,
      lastName,
      email, 
      password,
      passwordConfirm,
      organizationName,
      organiaztionId
    } = this.state;
  
    const { reactory } = this.props;
    const { nilStr, isValidPassword } = reactory.utils

    let valid = true;
    
    let errors = {
      firstName: null,
      lastName: null,
      email: null, 
      password: null,
      passwordConfirm: null,
      organizationName: null
    }


    if(nilStr(firstName)) {
      valid = false
      errors.firstName = 'Please enter your firstname'
    }

    if(nilStr(lastName)){
      valid = false
      errors.lastName = 'Please enter your lastname'
    }

    if(nilStr(email)){
      valid = false
      errors.email = 'Please enter your email address'
    }

    if(nilStr(password) || !isValidPassword(password)){
      valid = false
      errors.password = 'Please enter a password with at least 8 characters'
    }

    if(nilStr(passwordConfirm) || password !== passwordConfirm){
      valid = false
      errors.passwordConfirm = 'Ensure your confirm and password match'
    }

    return {
      valid,
      errors
    }
  }

  render() {
    const that = this;
    const { doRegister, props, context, formValid } = that;
    const { theme } = that.props;

    const validationResult = formValid()
    const { classes } = that.props

    const { 
      MaterialCore
    } = this.props.reactory.getComponent<Reactory.Client.Web.IMaterialModule>("material-ui.Material@1.0.0");
    
    const {
      Button,
      Icon,
      Paper,
      TextField,
    } = MaterialCore;

    return (
      <div>
           <Paper className={classes.root}>
            <div className={classes.logo}>            
            </div>
            <TextField
              label="Organisation"              
              value={this.state.organizationName}
              onChange={this.updateOrganizationName}
              placeholder='Your company name'
              />

             <TextField
              label="Firstname"              
              value={this.state.firstName}
              onChange={this.updateFirstname}
               />

               <TextField
              label="Lastname"
              value={this.state.lastName}
              onChange={this.updateLastname}
               />

            <TextField
              label="Email"
              value={this.state.email}
              onChange={this.updateEmail}
               />

            <TextField
              label='Password'
              type='password'              
              value={this.state.password}
              onChange={this.updatePassword}
            />

            <TextField
                label='Password Confirm'
                type='password'                
                value={this.state.passwordConfirm}
                onChange={this.updatePasswordConfirm}
              />
              
            <Button
              id="doRegisterButton"                          
              onClick={doRegister} 
              color="primary" 
              variant='contained'
              disabled={ formValid().valid === false }>
              <Icon className="fas fa-sign-in-alt"  />
              Register
            </Button>

            <h2>OR</h2>
            <Button onClick={ evt => this.props.history.push('/login')} color='secondary'>                              
                Login
            </Button>            
          </Paper>
      </div>)
  } 
};

type TRegister = typeof RegisterCard;

const RegisterCardRegistration: Reactory.Client.IReactoryComponentRegistryEntry<TRegister> = {
  nameSpace: "core",
  name: "Register",
  version: "1.0.0",
  component: RegisterCard,
  componentType: "form",
  connectors: [],
  roles: ["ANON", "USER"],
  tags: ["register", "user"]
};

export default RegisterCardRegistration;