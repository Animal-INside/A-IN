// services/MemberService.js
import { API_BASE_URL } from "../config/apiConfig";
import { authService } from "./authService";

class MemberServiceClass {
    // 특정 사용자의 정보 조회
    async getSomeoneInfo(memberId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/member/${memberId}`, {
                method: 'GET',
                headers: {
                    ...authService.getAuthHeader(),
                    'Content-Type': 'application/json',
                }
            });

            // 응답이 실패하면 에러 처리
            if (!response.ok) {
                console.error('Error fetching member info:', response.status, response.statusText);
                throw new Error('Failed to fetch member info');
            }

            const data = await response.json();

            // pet 데이터 평탄화: 배열 안에 배열이 있을 경우 평탄화 처리
            const pets = Array.isArray(data.pet) ? data.pet.flat() : data.pet ? [data.pet] : [];

            return {
                member: data.member,
                pets: pets, // 평탄화된 pets 데이터
                follows: data.follows || { follower: 0, following: 0 },
                isFollowing: data.isFollowing || false
            };
        } catch (error) {
            console.error('Error fetching member info:', error);
            throw error;
        }
    }

    // 팔로우하기
    async followMember(followingId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/follow/${followingId}`, {
                method: 'POST',
                headers: {
                    ...authService.getAuthHeader(),
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Failed to follow member');
            }
            return true;
        } catch (error) {
            console.error('Error following member:', error);
            throw error;
        }
    }

    // 언팔로우하기
    async unfollowMember(followingId) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/follow/${followingId}`, {
                method: 'DELETE',
                headers: {
                    ...authService.getAuthHeader(),
                    'Content-Type': 'application/json',
                }
            });
            if (!response.ok) {
                throw new Error('Failed to unfollow member');
            }
            return true;
        } catch (error) {
            console.error('Error unfollowing member:', error);
            throw error;
        }
    }
}

export const memberService = new MemberServiceClass();
