import type React from "react"

const ProfileImage: React.FC = () => (
  <div className="relative w-100 h-100 rounded-full overflow-hidden">
    <img
      src="/profile.jpg"
      alt="Portrait of Satyam Kumar Jha"
      width={360}
      height={450}
      fetchPriority="high"
      decoding="async"
      className="w-full h-full object-cover"
    />
  </div>
)

export default ProfileImage
