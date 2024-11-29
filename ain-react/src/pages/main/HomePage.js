import React from "react";
import InfiniteScroll from "react-infinite-scroll-component"
import axios from "axios"

// Home Page


const HomePage = () => {
    return (
      <div className="p-4">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold mb-2">최신 스토리</h2>
          <div className="flex overflow-x-auto space-x-4 py-2">
            <div className="flex-shrink-0 w-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full mb-1"></div>
              <p className="text-xs text-center">멍멍이</p>
            </div>
            <div className="flex-shrink-0 w-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full mb-1"></div>
              <p className="text-xs text-center">냥이</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">최신 게시글</h2>
          <div className="space-y-4">
            <div className="border-b pb-4">
              <div className="aspect-square bg-gray-100 rounded-lg mb-2"></div>
              <p className="text-sm">우리 강아지 산책 나왔어요 🐕</p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
export default HomePage;