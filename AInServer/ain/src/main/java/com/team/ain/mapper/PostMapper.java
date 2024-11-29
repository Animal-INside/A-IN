package com.team.ain.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.team.ain.dto.Post;

@Mapper
public interface PostMapper {
    void insertPost(Post post); //생성
    void updatePost(Post post); //수정
    void deletePost(Long id);   //삭제
    void softDeletePost(Long id); //'삭제 상태'로 변경 -- DB에 데이터는 남김
    Post getPostById(Long id);  //ID기반 게시글 조회
    List<Post> getAllPosts();   //모든 게시글 조회

     // 페이지 단위로 게시글 가져오기
    List<Post> getPostsByPage(@Param("limit") int limit, @Param("offset") int offset);
} 