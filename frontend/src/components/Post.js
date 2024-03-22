import React, {useState} from 'react';
import heart from '../images/heart.png';

const Post = ({ post }) => {

    const [likeStatus, setLikeStatus] = useState('')

    // combine set_unlike and set_like and just toggle the method {post||delete} and visual indicator for like based
    //      on if it's liking or unliking
    const set_unlike = async function() {
        try {
            const unlikeResponse = await fetch(window.location.origin + '/post/' + post.post_uuid + '/like', {
                method: 'DELETE',
            });
            setLikeStatus(unlikeResponse.status + unlikeResponse.statusText)
        } catch (error) {
            console.error('Error: Unlike request failed', error);
        }
    }
    const set_like = async function() {
        try {
            const likeResponse = await fetch(window.location.origin + '/post/' + post.post_uuid + '/like', {
                method: 'POST',
            });
            setLikeStatus(likeResponse.status + likeResponse.statusText)
        } catch (error) {
            console.error('Error: Unlike request failed', error);
        }
    }

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
                <img src={window.location.origin+'/brand/'+post.car_make_id+'/logo.svg'} alt={post.car_make} />
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

                    {/* fix this stuff. to work with like button. its gonna be broken for a while until the feed also informs if a post is liked */}
                    <button onClick={() => (set_like())}>like</button>
                    <button onClick={() => (set_unlike())}>unlike</button>
                    <p>like status: {likeStatus}</p>

                </div>
            </div>
        </div>
    );
};

export default Post;
