import React from 'react';
import heart from '../images/heart.png';

const Post = ({ post }) => {
    return (
        <div className="post">
            <div>
                <p>
                    <img className="postPfp" src={window.location.origin + '/pfp/' + post.poster_pfp} alt={post.poster_displayname} />
                    {post.poster_displayname}
                </p>
                <p> {post.post_location && post.post_location.join(" • ")} </p>
            </div>
            <div className="cardHeader">
                <img src={post.make_icon} alt={post.car_make} />
                <h2>
                    {
                        post.car_make + ' ' +
                        post.car_model + ' ' +
                        post.car_start_year + '-' + post.car_end_year
                    }
                </h2>
            </div>
            <div className="main">
                <div className="imageContainer">
                    <img src={'data:image/jpg;base64,' + post.post_image} alt={post.car_model} className='postImage'/>
                </div>
                <div>
                    <p>
                        {post.post_timestamp.toLocaleString(
                            'default', 
                            { year: 'numeric', month: '2-digit', day: '2-digit', hour: 'numeric', minute: '2-digit', hour12: true }
                        )}
                    </p>
                    <img src={heart} alt={post.post_likes} className='likeImage'/>
                    <span className='whiteFont'>{post.post_likes}</span>
                    <p>{post.car_details}</p>
                    <p>{post.post_uuid}</p>
                </div>
            </div>
        </div>
    );
};

export default Post;
