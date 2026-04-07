'use client'

import { cn } from '@/lib/utils'
import { RARITY_COLORS, CATEGORY_ICONS, type AchievementDefinition } from '@/lib/achievements'

interface AchievementBadgeProps {
  achievement: AchievementDefinition & { earnedAt?: string | Date | null }
  size?: 'sm' | 'md' | 'lg'
  showDetails?: boolean
  isAnimated?: boolean
  className?: string
}

export function AchievementBadge({ 
  achievement, 
  size = 'md', 
  showDetails = true,
  isAnimated = false,
  className 
}: AchievementBadgeProps) {
  const colors = RARITY_COLORS[achievement.rarity]
  
  const sizeClasses = {
    sm: 'w-12 h-12 text-xl',
    md: 'w-16 h-16 text-2xl',
    lg: 'w-24 h-24 text-4xl'
  }

  const iconSizeClasses = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl'
  }

  return (
    <div 
      className={cn(
        'relative group',
        className
      )}
    >
      <div 
        className={cn(
          'rounded-full flex items-center justify-center transition-all duration-300',
          sizeClasses[size],
          colors.bg,
          colors.border,
          'border-2',
          isAnimated && 'animate-bounce',
          achievement.earnedAt ? 'opacity-100' : 'opacity-40 grayscale',
          'hover:scale-110 cursor-pointer',
          'shadow-lg',
          colors.glow
        )}
      >
        <span className={iconSizeClasses[size]}>{achievement.icon}</span>
      </div>
      
      {/* Rarity indicator */}
      {achievement.rarity !== 'common' && (
        <div 
          className={cn(
            'absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-slate-900',
            achievement.rarity === 'rare' && 'bg-blue-500',
            achievement.rarity === 'epic' && 'bg-purple-500',
            achievement.rarity === 'legendary' && 'bg-amber-500 animate-pulse'
          )}
        />
      )}

      {/* Tooltip */}
      {showDetails && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
          <div className={cn(
            'px-3 py-2 rounded-lg shadow-xl text-sm whitespace-nowrap',
            'bg-slate-800 border border-slate-700'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <span>{achievement.icon}</span>
              <span className="font-semibold text-white">{achievement.name}</span>
            </div>
            <p className="text-slate-300 text-xs">{achievement.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={cn(
                'text-xs px-2 py-0.5 rounded-full',
                colors.bg, colors.text, colors.border, 'border'
              )}>
                {achievement.rarity}
              </span>
              <span className="text-slate-400 text-xs">
                {CATEGORY_ICONS[achievement.category]} {achievement.category}
              </span>
            </div>
            {achievement.earnedAt && (
              <p className="text-slate-500 text-xs mt-1">
                Earned: {new Date(achievement.earnedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

// Achievement notification popup
interface AchievementNotificationProps {
  achievement: AchievementDefinition
  onClose: () => void
}

export function AchievementNotification({ achievement, onClose }: AchievementNotificationProps) {
  const colors = RARITY_COLORS[achievement.rarity]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className={cn(
        'bg-slate-900 border-2 rounded-2xl p-8 max-w-md mx-4 text-center animate-in zoom-in duration-300',
        colors.border,
        colors.glow
      )}>
        <div className="mb-4">
          <span className="text-6xl animate-bounce inline-block">{achievement.icon}</span>
        </div>
        
        <h2 className="text-2xl font-bold text-white mb-2">Achievement Unlocked!</h2>
        
        <h3 className={cn('text-xl font-semibold mb-2', colors.text)}>
          {achievement.name}
        </h3>
        
        <p className="text-slate-300 mb-4">{achievement.description}</p>
        
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className={cn(
            'text-sm px-3 py-1 rounded-full',
            colors.bg, colors.text, colors.border, 'border'
          )}>
            {achievement.rarity.toUpperCase()}
          </span>
          <span className="text-amber-400 text-sm">
            +{achievement.pointsValue} points
          </span>
        </div>

        <button
          onClick={onClose}
          className={cn(
            'px-6 py-2 rounded-lg font-semibold transition-colors',
            colors.bg, colors.text, colors.border, 'border',
            'hover:brightness-110'
          )}
        >
          Awesome!
        </button>
      </div>
    </div>
  )
}

// Achievement grid display
interface AchievementGridProps {
  achievements: Array<AchievementDefinition & { earnedAt?: string | Date | null }>
  size?: 'sm' | 'md' | 'lg'
  maxDisplay?: number
}

export function AchievementGrid({ achievements, size = 'md', maxDisplay }: AchievementGridProps) {
  const displayAchievements = maxDisplay ? achievements.slice(0, maxDisplay) : achievements
  const remaining = maxDisplay ? achievements.length - maxDisplay : 0

  return (
    <div className="flex flex-wrap gap-2">
      {displayAchievements.map((achievement, index) => (
        <AchievementBadge 
          key={achievement.id || index} 
          achievement={achievement}
          size={size}
        />
      ))}
      {remaining > 0 && (
        <div className={cn(
          'rounded-full flex items-center justify-center bg-slate-700/50 border border-slate-600',
          size === 'sm' && 'w-12 h-12 text-xs',
          size === 'md' && 'w-16 h-16 text-sm',
          size === 'lg' && 'w-24 h-24 text-base'
        )}>
          +{remaining} more
        </div>
      )}
    </div>
  )
}
