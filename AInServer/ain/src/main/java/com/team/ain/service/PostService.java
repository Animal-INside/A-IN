package com.team.ain.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.team.ain.dto.Post;
import com.team.ain.mapper.PostMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PostService {
    
    private final PostMapper postMapper;

    //생성
    public void createPost(Post post){
        postMapper.insertPost(post);
    }

    //수정
    public void updatePost(Post post){
        postMapper.updatePost(post);
    }

    //삭제
    public void deletePost(Long postId){
        postMapper.deletePost(postId);
    }

    //'삭제상태'로 변경 -- DB에 데이터 남김
    public void softDeletePost(Long postId) {
        postMapper.softDeletePost(postId);
    }

    //ID로 게시글 조회
    public Post getPostById(Long postId){
        return postMapper.getPostById(postId);
    }

    //전체 게시글 조회
    public List<Post> getAllPosts(){
        return postMapper.getAllPosts();
    }

    //게시글 페이징 처리
    public List<Post> getPostsByPage(int limit, int offset){
        return postMapper.getPostsByPage(limit,offset);
    }
    
}
