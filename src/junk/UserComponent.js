import React from 'react';
import UiCore, {Grid} from "@material-ui/core";
import UiIcon from "@material-ui/icons";
import UserService from "./UserService";

class UserComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users : []
        }
    }

    componentDidMount() {
        UserService.getUsers().then((response) => {
            this.setState({ users : response.data })
        })
    }

    render() {
        return (
            <div>
                <h1 className = "text-center"> Users List</h1>
                <table className = "table table-striped">
                    <thead>
                        <tr>
                            <td> User ID </td>
                            <td> User First Name </td>
                            <td> User Last Name </td>
                            <td> User Email </td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.users.map(
                                user =>
                                    <tr key = {user.id}>
                                        <td> {user.id} </td>
                                        <td> {user.firstName} </td>
                                        <td> {user.lastName} </td>
                                        <td> {user.email} </td>
                                    </tr>
                            )
                        }
                    </tbody>
                </table>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <button> Test-Button</button>
                    </Grid>
                    <button> Test-Button</button>
                </Grid>
            </div>
        )
    }

}

export default UserComponent