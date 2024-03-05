import "./RenderUserList.css"

import { useNavigate } from 'react-router-dom';
import DefaultProfilePicture from '../images/DefaultProfilePicture.png';

export default function RenderUserList({users}) {
    const navigate = useNavigate();
    return <div>
        <ul className='unorderedUserList'>
            {users.map((user, index) => (
                <li key={index}>
                <button className='userButtonLink' onClick={() => navigate( '/garage/' + user["displayname"] )}>
                        <img src={window.location.origin + '/pfp/' + user["pfp_id"]}/> {user["displayname"]}
                    </button>
                </li>
            ))}
        </ul>
    </div>
}