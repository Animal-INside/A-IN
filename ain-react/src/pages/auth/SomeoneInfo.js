import { User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { memberService } from '../../services/MemberService';

const CustomButton = ({ onClick, disabled, variant, className, children }) => {
    const baseStyles = "px-4 py-2 rounded-md font-medium transition-colors duration-200";
    const variants = {
        default: "bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300",
        outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:bg-gray-100"
    };

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseStyles} ${variants[variant || 'default']} ${className || ''}`}
        >
            {children}
        </button>
    );
};

const SomeoneInfo = ({ pageData }) => {
    const [data, setData] = useState({
        member: null,
        pets: [],  // pets는 배열로 처리합니다
        follows: { follower: 0, following: 0 },
        isFollowing: false
    });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [activeTab, setActiveTab] = useState("pets");

    useEffect(() => {
        const fetchData = async () => {
            if (!pageData?.memberId) return;
    
            try {
                const response = await memberService.getSomeoneInfo(pageData.memberId);
                console.log('Fetched response:', response);  // 응답 확인
                
                // pets가 배열 배열인 경우만 평탄화 처리
                const flattenedPets = Array.isArray(response.pets) && Array.isArray(response.pets[0])
                    ? response.pets.flat()  // 배열의 배열을 평탄화
                    : response.pets;  // 이미 평탄화된 경우 그대로 사용
    
                setData({
                    member: response.member,
                    pets: flattenedPets,
                    follows: response.follows || { follower: 0, following: 0 },
                    isFollowing: response.isFollowing || false
                });
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };
    
        fetchData();
    }, [pageData?.memberId]);
    

    const handleFollowClick = async () => {
        if (!data?.member?.id || isProcessing) return;

        setIsProcessing(true);
        try {
            if (data.isFollowing) {
                await memberService.unfollowMember(data.member.id);
                setData(prev => ({ ...prev, isFollowing: false }));
            } else {
                await memberService.followMember(data.member.id);
                setData(prev => ({ ...prev, isFollowing: true }));
            }
            
            // 팔로우 수 업데이트를 위한 데이터 새로고침
            const updatedData = await memberService.getSomeoneInfo(pageData.memberId);
            setData(prev => ({
                ...prev,
                follows: updatedData.follows || { follower: 0, following: 0 }
            }));
        } catch (err) {
            console.error('Error handling follow:', err);
        } finally {
            setIsProcessing(false);
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const stats = [
        { label: "반려동물", value: data.pets?.length || 0 },  // pets의 길이로 수정
        { label: "팔로워", value: data.follows?.follower || 0 },
        { label: "팔로잉", value: data.follows?.following || 0 },
    ];

    const tabs = [
        { id: "pets", label: "반려동물" },
        { id: "posts", label: "게시물" },  // 포스트 탭은 아직 구현되지 않았지만 향후 확장 가능
    ];

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white rounded-lg shadow-lg">
                {/* 프로필 섹션 */}
                <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-8">
                    <div className="shrink-0">
                        <div className="h-20 w-20 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                            {data.member?.profilePictureUrl ? (
                                <img 
                                    src={data.member.profilePictureUrl} 
                                    alt={data.member.name} 
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <User className="h-12 w-12 text-gray-400" />
                            )}
                        </div>
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-xl sm:text-2xl font-bold mb-4"></h2>
                        <div className="grid grid-cols-3 gap-4 mb-4 w-full max-w-[400px] mx-auto sm:mx-0">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <span className="font-semibold block">{stat.value}</span>
                                    <span className="text-sm text-gray-600 block whitespace-nowrap">{stat.label}</span>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center sm:justify-start mb-4">
                            <CustomButton
                                onClick={handleFollowClick}
                                disabled={isProcessing}
                                variant={data.isFollowing ? "outline" : "default"}
                                className="w-[200px]"
                            >
                                {data.isFollowing ? '언팔로우' : '팔로우'}
                            </CustomButton>
                        </div>
                    </div>
                </div>

                {/* 탭 네비게이션 */}
                <div className="border-t">
                    <div className="grid grid-cols-2 w-full">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`py-4 text-xs font-medium tracking-wider uppercase text-center ${activeTab === tab.id ? "text-black border-b-2 border-black" : "text-gray-500 hover:text-gray-900"}`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* 탭 컨텐츠 */}
                <div className="p-6">
                    {activeTab === "pets" && (
                        <div>
                            {data.pets && data.pets.length > 0 ? (
                                data.pets.map((pet) => (
                                    <div key={pet.id} className="mb-6 last:mb-0">
                                        <h3 className="text-xl font-semibold mb-4">반려동물 정보</h3>
                                        <div className="flex items-start gap-6">
                                            <div className="w-32 h-32 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                                                {pet.photoUrl ? (
                                                    <img 
                                                        src={pet.photoUrl} 
                                                        alt={pet.name} 
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-gray-400 text-center">
                                                        <span className="block">No Photo</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <p className="text-gray-500">이름</p>
                                                        <p className="font-medium">{pet.name}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">나이</p>
                                                        <p className="font-medium">{pet.age}세</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">종류</p>
                                                        <p className="font-medium">{pet.species}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">품종</p>
                                                        <p className="font-medium">{pet.breed}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-500">성별</p>
                                                        <p className="font-medium">{pet.gender}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-gray-500 text-center">
                                    아직 등록된 반려동물이 없습니다.
                                </div>
                            )}
                        </div>
                    )}
                    {activeTab === "posts" && (
                        <div className="text-center text-sm text-gray-500">
                            아직 게시물이 없습니다.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SomeoneInfo;
