import React from "react"
import Card from "@/components/atoms/Card"
import Badge from "@/components/atoms/Badge"
import Avatar from "@/components/atoms/Avatar"
import ApperIcon from "@/components/ApperIcon"

const GuestCard = ({ guest, onClick }) => {
  return (
    <Card 
      variant="elevated" 
      className="p-6 cursor-pointer hover:shadow-glow transition-all duration-300"
      onClick={() => onClick(guest)}
    >
      <div className="flex items-start gap-4">
        <Avatar 
fallback={`${(guest.first_name_c || guest.firstName || "G").charAt(0)}${(guest.last_name_c || guest.lastName || "U").charAt(0)}`}
          size="lg"
        />
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {guest.first_name_c || guest.firstName} {guest.last_name_c || guest.lastName}
              </h3>
              <p className="text-sm text-slate-600">{guest.email_c || guest.email}</p>
            </div>
            {(guest.vip_status_c || guest.vipStatus) && (
              <Badge variant="warning" className="flex items-center gap-1">
                <ApperIcon name="Crown" size={12} />
                VIP
              </Badge>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ApperIcon name="Phone" size={14} />
              <span>{guest.phone_c || guest.phone}</span>
            </div>
            
            {(guest.stay_history_c || guest.stayHistory) && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ApperIcon name="History" size={14} />
                <span>{guest.stay_history_c || guest.stayHistory}</span>
              </div>
            )}
            
{(guest.preferences_c || guest.preferences) && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ApperIcon name="Settings" size={14} />
                <span>Has preferences</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default GuestCard