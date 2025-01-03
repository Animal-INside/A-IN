package com.team.ain.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.team.ain.dto.chat.ChatMember;
import com.team.ain.dto.chat.ChatMessageDTO;
import com.team.ain.dto.chat.ChatRoomDTO;
import com.team.ain.mapper.ChatMessageMapper;
import com.team.ain.mapper.ChatRoomMapper;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class ChatService {
    
    private final ChatRoomMapper chatRoomMapper;
    private final ChatMessageMapper chatMessageMapper;
    
    // 채팅방 생성
    public ChatRoomDTO createRoom(ChatRoomDTO roomDTO) {
        chatRoomMapper.insertRoom(roomDTO);
        // 방장을 채팅방 멤버로 추가
        chatRoomMapper.addRoomMember(roomDTO.getId(), roomDTO.getHostId());
        return roomDTO;
    }

    // 사용자의 채팅방 목록 조회
    public List<ChatRoomDTO> getUserRooms(Long userId) {
        return chatRoomMapper.getUserRooms(userId);
    }
    
    // 채팅방 참여
    public void joinRoom(Long roomId, Long userId) {
        // 이미 참여중인지 확인
        if (!chatRoomMapper.isRoomMember(roomId, userId)) {
            chatRoomMapper.addRoomMember(roomId, userId);
        }
    }
    
    // 메시지 저장 및 전송
    public ChatMessageDTO saveAndSendMessage(ChatMessageDTO message) {
        chatRoomMapper.readChatRoom(message.getRoomId(), message.getSenderId());
        chatMessageMapper.insertMessage(message);
        return message;
    }

    // 채팅방 멤버 조회
    public List<ChatMember> getRoomMembers(Long roomId) {
        return chatRoomMapper.findByRoomId(roomId);
    }
    
    // 마지막 읽은 시간 업데이트
    public void updateLastReadAt(Long roomId, Long memberId) {
        ChatMember member = chatRoomMapper.findByRoomIdAndMemberId(roomId, memberId)
            .orElseThrow(() -> new RuntimeException("채팅방 멤버를 찾을 수 없습니다."));
        member.setLastReadAt(LocalDateTime.now());
        chatRoomMapper.save(member);
    }
    
    // 읽지 않은 메시지 수 조회
    public int getUnreadMessageCount(Long memberId) {
        return chatMessageMapper.countUnreadMessages(memberId);
    }

    // 읽지않은 모든 메시지 수 가져오기
    public Integer getMessageCounts(Long userId) {
        return chatMessageMapper.getMessageCounts(userId);
    }

    // 채팅방 메시지 가져오기
    public List<ChatMessageDTO> getRoomMessages(Long roomId, Long userId) {
        chatRoomMapper.readChatRoom(roomId, userId);
        return chatMessageMapper.findMessagesByRoomId(roomId);
    }

    public ChatRoomDTO getRoomById(Long roomId) {
        return chatRoomMapper.findRoomById(roomId);
    }

    public Page<ChatRoomDTO> searchRooms(String keyword, Pageable pageable) {
        List<ChatRoomDTO> rooms;
        long total;
        
        if (keyword == null || keyword.trim().isEmpty()) {
            rooms = chatRoomMapper.findAllByIsActiveTrue(
                pageable.getPageNumber() * pageable.getPageSize(),  // offset
                pageable.getPageSize()                              // size
            );
            total = chatRoomMapper.countAllByIsActiveTrue();
        } else {
            rooms = chatRoomMapper.findByRoomNameContainingIgnoreCaseAndIsActiveTrue(
                keyword.trim(),
                pageable.getPageNumber() * pageable.getPageSize(),  // offset
                pageable.getPageSize()                              // size
            );
            total = chatRoomMapper.countByRoomNameContainingIgnoreCaseAndIsActiveTrue(
                keyword.trim());
        }
        
        return new PageImpl<>(rooms, pageable, total);
    }
}