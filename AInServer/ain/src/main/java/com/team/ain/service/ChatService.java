package com.team.ain.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.team.ain.dto.ChatMessageDTO;
import com.team.ain.dto.ChatRoomDTO;
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
        return chatRoomMapper.findRoomsByUserId(userId);
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
        chatMessageMapper.insertMessage(message);
        return message;
    }
}