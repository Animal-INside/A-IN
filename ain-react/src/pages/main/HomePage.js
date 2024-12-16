import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { API_BASE_URL } from "../../config/apiConfig";
import { authService } from "../../services/authService";
import StoryProfile from '../story/StoryProfile';
import StoryPost from "../story/StoryPost";

const HomePage = ({ onPageChange }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [stories, setStories] = useState([]);
  const [memberInfo, setMemberInfo] = useState(null);

  // 회원 정보 가져오기
  useEffect(() => {
    const fetchMemberInfo = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/member/my`, {
          headers: authService.getAuthHeader(),
        });
        if (!response.ok) throw new Error('Failed to fetch member info');
        const data = await response.json();
        setMemberInfo(data);
      } catch (error) {
        console.error('Error fetching member info:', error);
      }
    };

    fetchMemberInfo();
  }, []);

  // 스토리 데이터 가져오기
  useEffect(() => {
    const fetchStories = async () => {
      if (!authService.isAuthenticated()) {
        console.log("Authentication required");
        return;
      }
    
      try {
        const response = await fetch(`${API_BASE_URL}/api/stories/followed`, { 
          headers: authService.getAuthHeader(),
        });
        if (!response.ok) throw new Error('Failed to fetch stories');
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.error('Error fetching stories:', error);
      }
    };

    fetchStories();
  }, []);

  // 게시물 가져오기
  const fetchPosts = async () => {
    try {
      const size = 10;
      const response = await fetch(`${API_BASE_URL}/api/posts/page?page=${page}&size=${size}`, {
        method: "GET",
        headers: {
          ...authService.getAuthHeader(),
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) throw new Error("게시물 데이터를 가져오는데 실패했습니다.");
      
      const newPosts = await response.json();
      if (newPosts.length < size) {
        setHasMore(false);
      }
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-4">
      {/* Stories 섹션 */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Stories</h2>
        <div className="flex overflow-x-auto space-x-4 py-2">
          {/* 내 스토리 프로필 */}
          <StoryProfile
            isMyStory={true}
            profileImage={memberInfo?.member?.profile_picture_url}
            username="내 스토리"
            onPageChange={onPageChange}
          />
          
          {stories.length > 0 ? (
            // 팔로우한 유저들의 스토리
            stories.map((story) => (
              <StoryProfile
                key={story.id}
                isMyStory={false}
                profileImage={story.profilePictureUrl}
                username={story.memberName}
              />
            ))
          ) : (
            // 팔로우한 유저들의 스토리가 없을 때
            <div className="flex-1 flex items-center justify-center min-h-[80px]">
              <p className="text-xs text-gray-500">
                팔로우한 사용자의 스토리가 없습니다.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 최신 게시글 섹션 */}
      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-lg font-semibold mb-2">최신 게시글</h2>
        <InfiniteScroll
          dataLength={posts.length}
          next={fetchPosts}
          hasMore={hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={<p style={{ textAlign: "center" }}>새 게시글이 없습니다.</p>}
        >
          {posts.map((post) => (
            <StoryPost
              key={post.id}
              title={post.title || "제목 없음"}
              content={post.content || "내용 없음"}
              createdAt={new Date(post.createdAt).toLocaleDateString()}
            />
          ))}
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default HomePage;