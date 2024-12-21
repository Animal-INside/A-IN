package com.team.ain.mapper;

import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;

import com.team.ain.dto.auth.Member;
import com.team.ain.dto.auth.MemberJoin;
import com.team.ain.dto.auth.MemberProfile;

@Mapper
public interface MemberMapper {
    int insertMember(MemberJoin memberJoin);
    Optional<Member> findById(Long memberId);

    Optional<Member> findByEmail(String email);
    Optional<Member> findByPhoneNumber(String phoneNumber);
    int updateProfile(MemberProfile memberProfile);
    MemberProfile findNameAndProfileUrlById(Long id);

    //1215 프로필업뎃
    int updateMemberProfile(Member member);

}
