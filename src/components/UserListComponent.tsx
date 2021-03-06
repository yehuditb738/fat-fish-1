import { useEffect, useState } from 'react';
import UserComponent from '../components/UserComponent'
import ActionUserComponent from './ActionUserComponent'
import { IUser, IState, IAdress } from '../interfaces/interfaces';
import style from '../style/user-list.module.scss';
import { useDispatch, useSelector } from 'react-redux';


export default function List() {
    const userObj: IUser = {
        id: '',
        firstName: '',
        lastName: '',
        age: 0,
        phone: '',
    }
    const dispatch = useDispatch()
    // const [users, setusers] = useState(props.data)
    const users = useSelector((state: IState) => state.users);
    const [isShowActionPage, setIsShowActionPage] = useState(false);
    const [isCreate, setIsCreate] = useState(false);
    const [currentUser, setCurrentUser] = useState(userObj);
    const [filteredUsers, setFilteredUsers] = useState(users);
    const [searchTxt, setSearchTxt] = useState('');
    const [searchId, setSearchId] = useState('');


    // useEffect(() => {
    //     let newUserList = []
    //     if (users && Object.keys(users).length) {
    //         newUserList = Object.keys(users).map(userKey => {
    //             const user = { ...users[userKey], adress: (users[userKey].adress as IAdress)?.city }
    //             return user
    //         })
    //         console.log("newUserList", newUserList);
    //     }
    // }, [users])


    useEffect(() => {
        let val = searchTxt;
        if (val === "" && searchId === "") {
            setFilteredUsers(users)
            return
        }
        let userList = { ...users }
        const arr = Object.values(userList)
        const res = arr.filter((item) => (item.firstName.toLowerCase().includes(val.toLowerCase()) || item.lastName?.toLowerCase().includes(val.toLowerCase())) && item.id.includes(searchId))
        const usersDictionary: { [key: string]: IUser } = Object.assign({}, ...res.map((x) => ({ [x.id.toString()]: x })));
        setFilteredUsers(usersDictionary);
    }, [users, searchTxt, searchId]);

    function isShowActionPageFunc(isE: boolean, key?: string, isCre?: boolean) {
        //on edit
        if (key !== undefined) {
            const a = { ...users }
            setCurrentUser(a[key])
        }
        setIsShowActionPage(isE);
        if (isCre !== undefined)
            setIsCreate(isCre)
    }

    function addUser(userData: IUser) {
        //redux
        userData = { ...userData, id: (Math.random() * 100000).toFixed(0).toString() };
        dispatch({ type: 'ADD_USER', payload: userData })
        setIsShowActionPage(false);
    }

    function editOrAddUser(key: string, userData: IUser) {
        //add new user
        if (isCreate === true) {
            addUser(userData);
            setIsCreate(false)
            return
        }
        //edit exist user
        dispatch({ type: 'EDIT_USER', payload: userData })
        setIsShowActionPage(false)
    }

    function deleteUser(key: string) {
        dispatch({ type: 'DELETE_USER', payload: key })
    }

    if (isShowActionPage === false)
        return (
            <div>
                <div className={style.mainContainer}>
                    <button onClick={() => isShowActionPageFunc(true, undefined, true)}>ADD NEW USER</button><br />
                    <div className={style.actionButtonsContainer}>
                        <input value={searchTxt} onChange={(e) => setSearchTxt(e.target.value)} placeholder="SEARCH BY FULL NAME" /><br />
                        <input value={searchId} onChange={(e) => setSearchId(e.target.value)} placeholder="SEARCH BY ID" />
                    </div>
                    <div className={style.listItemContainer}>
                        {Object.keys(filteredUsers).map(key => {
                            return (
                                <UserComponent
                                    key={key}
                                    userData={filteredUsers[key]}
                                    deleteUser={() => deleteUser(key)}
                                    isShowActionPageFunc={(isEd: boolean) => isShowActionPageFunc(isEd, key)}
                                />
                            );
                        })
                        }
                    </div>
                </div>
            </div>
        );
    else
        return (
            <ActionUserComponent
                key={currentUser.id}
                userData={currentUser}
                editOrAddUser={(userData: IUser) => editOrAddUser(currentUser.id, userData)}
                isShowActionPageFunc={(isEd: boolean) => isShowActionPageFunc(isEd, undefined, false)}
                isCreate={isCreate}
            />
        );
}