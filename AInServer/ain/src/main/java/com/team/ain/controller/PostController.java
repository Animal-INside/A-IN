package com.team.ain.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.team.ain.dto.Post;
import com.team.ain.service.PostService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
public class PostController {
    
    private final PostService postSerivce;

    //생성
    @PostMapping
    public ResponseEntity<String> createPost(@RequestBody Post post){
        postSerivce.createPost(post);
        return ResponseEntity.ok("게시글이 등록 되었습니다.");
    }

    //수정
    @PutMapping("/{id}")
    public ResponseEntity<String> updatePost(@PathVariable Long id, @RequestBody Post post){
        post.setId(id);
        postSerivce.updatePost(post);
        return ResponseEntity.ok("수정 완료!");
    }

    //완전 삭제
    @DeleteMapping("/{id}/hard")
    public ResponseEntity<String> deletePost(@PathVariable Long id){
        postSerivce.deletePost(id);
        return ResponseEntity.ok("삭제 완료!");
    }

    // "삭제상태"로 변경
    @DeleteMapping("/{id}/soft")
    public ResponseEntity<String> softDeletePost(@PathVariable Long id){
        postSerivce.softDeletePost(id);
        return ResponseEntity.ok("삭제 되었습니다.");
    }
    
    //ID기반 게시글 조회
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id){
        Post post = postSerivce.getPostById(id);
        return ResponseEntity.ok(post);
    }

    //전체 게시글 조회
    @GetMapping("/all")
    public ResponseEntity<List<Post>> getAllPosts(){
        List<Post> posts = postSerivce.getAllPosts();

        //데이터가 없으면 빈 리스트 반환
        if(posts.isEmpty()){ 
            return ResponseEntity.ok(List.of());
        }
        //데이터 있으면 조회된 게시글 반환
        return ResponseEntity.ok(posts);
    }

    //게시글 페이징 처리
    @GetMapping("/page")
    public ResponseEntity<List<Post>> getPostsByPage(
            @RequestParam int page, //페이지 번호
            @RequestParam int size  //페이지 게시글 수
    ){
       int offset = page * size; //offset 계산
       List<Post> posts = postSerivce.getPostsByPage(size, offset);
       return ResponseEntity.ok(posts);
    }
}