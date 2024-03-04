import "./RenderUserList.css"

import Garage from '../pages/GaragePage';
import DefaultProfilePicture from '../images/DefaultProfilePicture.png';

export default function RenderUserList({changePage, setActivePage, users}) {
    return <div>
        <ul className='unorderedUserList'>
            {users.map((user, index) => (
                <li key={index}>
                    <button className='userButtonLink' onClick={() => setActivePage(<Garage changePage={changePage} profile={user["displayname"]}/>)}>
                        <img src={window.location.origin + '/pfp/' + user["pfp_id"]}/> {user["displayname"]}
                    </button>
                </li>
            ))}
        </ul>
    </div>
}