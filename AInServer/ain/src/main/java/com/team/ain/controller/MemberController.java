package com.team.ain.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.team.ain.config.jwt.JwtTokenProvider;
import com.team.ain.dto.auth.MemberJoin;
import com.team.ain.dto.auth.MemberUpdateDTO;
import com.team.ain.service.FollowerService;
import com.team.ain.service.MemberService;
import com.team.ain.service.PetService;
import com.team.ain.service.PostService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;



@RestController
@RequestMapping("/api/member")
@RequiredArgsConstructor
public class MemberController {

    private final MemberService memberService;
    private final PetService petService;
    private final FollowerService followerService;
    private final PostService postService;
    private final JwtTokenProvider jwtTokenProvider;

    @PostMapping("/signup")
    public ResponseEntity<String> signup(@RequestBody MemberJoin memberJoin) {
        
        memberService.signup(memberJoin);
        
        return ResponseEntity.ok("회원가입 성공");
    }
    
    @GetMapping("/my")
    public Map<String, Object> getMemberInfo(@AuthenticationPrincipal UserDetails userDetails) {
        String email = userDetails.getUsername();
        Long memberId = memberService.findByEmail(email).getId(); // memberId 가져오기

        Map<String, Object> response = new HashMap<>();
        response.put("member", memberService.findByEmail(email));
        response.put("pet", petService.findByEmail(email));

        // 팔로워/팔로잉 정보 추가
        Map<String, Integer> followStats = followerService.checkFollwers(memberId);
        response.put("follows", followStats);  // 팔로워와 팔로잉 수 포함

        return response;
    }



    @GetMapping("/{memberId}")
    public Map<String, Object> getSomeoneInfo(@PathVariable Long memberId, HttpServletRequest request) {
        Long userId = jwtTokenProvider.getMemberIdFromRequest(request);

        Map<String, Object> response = new HashMap<>();
        response.put("isFollowing", followerService.isFollowing(userId, memberId));
        response.put("member", memberService.findNameAndProfileUrlById(memberId));
        response.put("pet", petService.getPetByMeberId(memberId));
        response.put("follows", followerService.checkFollwers(memberId));
        // post 추가
        return response;
    }

    //1215 프로필 업뎃
    @PutMapping("/update")
    public ResponseEntity<String> updateProfile(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestBody MemberUpdateDTO updateDTO
    ) {
        String email = userDetails.getUsername();
        memberService.updateMemberProfile(email, updateDTO);
        return ResponseEntity.ok("프로필이 성공적으로 업데이트되었습니다.");
    }
        
}
