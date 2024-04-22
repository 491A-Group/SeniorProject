import React, {useState} from 'react';
import heart from '../images/heart.png';

const Post = ({ post }) => {
    //console.log(post)

    const [likeStatus, setLikeStatus] = useState('')
    const [isLiked, setIsLiked] = useState(post.post_liked_by_current_user)
    const [likeCount, setLikeCount] = useState(post.post_likes);

    // combine set_unlike and set_like and just toggle the method {post||delete} and visual indicator for like based
    //      on if it's liking or unliking
    // const set_unlike = async function() {
    //     try {
    //         const unlikeResponse = await fetch(window.location.origin + '/post/' + post.post_uuid + '/like', {
    //             method: 'DELETE',
    //         });
    //         setLikeStatus(unlikeResponse.status + unlikeResponse.statusText)
    //     } catch (error) {
    //         console.error('Error: Unlike request failed', error);
    //     }
    // }
    // const set_like = async function() {
    //     try {
    //         const likeResponse = await fetch(window.location.origin + '/post/' + post.post_uuid + '/like', {
    //             method: 'POST',
    //         });
    //         setLikeStatus(likeResponse.status + likeResponse.statusText)
    //     } catch (error) {
    //         console.error('Error: Unlike request failed', error);
    //     }
    // }

    const toggleLike = async () => {
        try {
            const response = await fetch(window.location.origin +'/post/' + post.post_uuid + '/like', {
                method: isLiked ? 'DELETE' : 'POST', // Toggle like and unlike
            });

            if (response.ok) {
                setLikeStatus(response.status + response.statusText);
                setIsLiked(!isLiked);
                setLikeCount(prevCount => isLiked ? prevCount - 1 : prevCount + 1);
            }
            else {
                console.error('Error: Like/Unlike request failed');
            }
        }
        catch (error) {
            console.error('Error: Like/Unlike request failed', error);
        }
    };

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
                    <div style = {{display: 'flex'}}>
                        <button onClick={toggleLike} style={{width: '10%', height: '100%', maxWidth: '10%', background: 'none', border: 'none', textAlign: 'left'}}>
                            <img src={heart} alt={isLiked ? 'Unlike' : 'Like'} className='likeImage' style={{ width: '100%', height: '100%'}}/>  
                        </button>
                        <span className='whiteFont'>{likeCount}</span>
                    </div>
                    <p>{post.car_details}</p>
                </div>
            </div>
        </div>
    );
};

export default Post;
