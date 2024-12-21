package com.team.ain.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team.ain.config.jwt.JwtTokenProvider;
import com.team.ain.service.FollowerService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/follow")
@RequiredArgsConstructor
public class FollowerController {

    public final FollowerService followerService;
    private final JwtTokenProvider jwtTokenProvider;

    // 팔로우 신청
    @PostMapping("/{followingId}")
    public ResponseEntity<Void> follow(@PathVariable Long followingId, HttpServletRequest request) {
        Long followerId = jwtTokenProvider.getMemberIdFromRequest(request);
        followerService.follow(followerId, followingId);
        return ResponseEntity.ok().build();
    }
    
    // 팔로우 삭제
    @DeleteMapping("/{followingId}")
    public ResponseEntity<Void> unfollow(@PathVariable Long followingId, HttpServletRequest request) {
        Long followerId = jwtTokenProvider.getMemberIdFromRequest(request);
        followerService.unfollow(followerId, followingId);
        return ResponseEntity.ok().build();
    }
}
