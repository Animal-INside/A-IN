import React from 'react';

const SearchResultsPage = ({ 
    searchResults, 
    onBack, 
    onJoinRoom, 
    loading, 
    error,
    searchKeyword,
    onSearchChange,
    onSearch 
}) => {
    return (
        <div className="p-4">
            <div className="bg-white rounded-lg shadow p-4">
                <div className="flex items-center mb-4">
                    <button
                        onClick={onBack}
                        className="mr-4 text-gray-600 hover:text-gray-800"
                    >
                        ← 뒤로
                    </button>
                    <h2 className="text-lg font-semibold">검색 결과</h2>
                </div>

                {/* 검색 폼 */}
                <form onSubmit={onSearch} className="mb-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={searchKeyword}
                            onChange={onSearchChange}
                            placeholder="채팅방 검색..."
                            className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                            disabled={loading}
                        >
                            검색
                        </button>
                    </div>
                </form>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {loading ? (
                    <div className="text-center py-4">검색 중...</div>
                ) : searchResults.length === 0 ? (
                    <div className="text-center py-4 text-gray-600">
                        검색 결과가 없습니다.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {searchResults.map((room) => (
                            <div 
                                key={room.id} 
                                className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50"
                                onClick={() => onJoinRoom(room.id)}
                            >
                                <h3 className="font-medium">{room.roomName}</h3>
                                <p className="text-sm text-gray-600 mt-1">{room.description}</p>
                                <div className="flex justify-between items-center mt-2">
                                    <p className="text-sm text-gray-600">참여자: {room.memberCount || 0}명</p>
                                    <span className="text-xs text-gray-500">
                                        {new Date(room.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResultsPage;