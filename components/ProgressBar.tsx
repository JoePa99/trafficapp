'use client'

interface Step {
  id: string
  title: string
}

interface ProgressBarProps {
  steps: Step[]
  currentStep: string
}

export default function ProgressBar({ steps, currentStep }: ProgressBarProps) {
  const currentStepIndex = steps.findIndex(step => step.id === currentStep)

  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex
          
          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${isCompleted
                    ? 'bg-primary-600 text-white'
                    : isCurrent
                    ? 'bg-primary-100 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400'
                    : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500'
                  }
                `}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <span
                className={`
                  mt-2 text-sm font-medium
                  ${isCompleted || isCurrent
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-500 dark:text-gray-400'
                  }
                `}
              >
                {step.title}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
} 