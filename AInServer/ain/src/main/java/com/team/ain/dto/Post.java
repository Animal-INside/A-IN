package com.team.ain.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Post {
    private Long id;    //게시글 ID
    private String title;   //게시글 제목
    private String content; //게시글 내용
    private int memberId;  //작성자
    private String status; //게시글 상태(ACTIVE or DELETED)
    private LocalDateTime createdAt;    //게시글 생성일
    private LocalDateTime updatedAt;    //게시글 수정일
    private String mediaUrl; //미디어 파일
    private String mediaType; //미디어 파일 유형 (img, video)
}
