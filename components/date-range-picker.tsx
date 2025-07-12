"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, X } from "lucide-react"

interface DateRangePickerProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (range: { start: string; end: string } | null) => void
  currentRange: { start: string; end: string } | null
}

export default function DateRangePicker({ isOpen, onClose, onSelect, currentRange }: DateRangePickerProps) {
  const [startDate, setStartDate] = useState(currentRange?.start || "")
  const [endDate, setEndDate] = useState(currentRange?.end || "")

  const handleApply = () => {
    if (startDate && endDate) {
      onSelect({ start: startDate, end: endDate })
    }
    onClose()
  }

  const handleClear = () => {
    setStartDate("")
    setEndDate("")
    onSelect(null)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-slate-800 border-slate-700 font-montserrat mx-4 sm:mx-auto">
        <DialogHeader className="relative">
          <DialogTitle className="text-slate-100 text-xl font-semibold text-center pr-8">Select Date Range</DialogTitle>
          <button
            onClick={onClose}
            className="absolute right-0 top-0 p-1 rounded-md hover:bg-slate-700 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5 text-slate-400 hover:text-slate-200" />
          </button>
        </DialogHeader>

        <div className="space-y-6 pt-2">
          {/* Start Date */}
          <div className="space-y-2">
            <Label htmlFor="start-date" className="text-slate-200 font-medium text-sm">
              Start Date
            </Label>
            <div className="relative">
              <Input
                id="start-date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-slate-700 border-slate-600 text-slate-100 pr-12 py-3 text-sm focus:border-slate-400 focus:ring-slate-400"
                placeholder="dd-mm-yyyy"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label htmlFor="end-date" className="text-slate-200 font-medium text-sm">
              End Date
            </Label>
            <div className="relative">
              <Input
                id="end-date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                min={startDate}
                className="bg-slate-700 border-slate-600 text-slate-100 pr-12 py-3 text-sm focus:border-slate-400 focus:ring-slate-400"
                placeholder="dd-mm-yyyy"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <Calendar className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              variant="outline"
              onClick={handleClear}
              className="flex-1 bg-slate-700 border-slate-600 text-slate-100 hover:bg-slate-600 font-medium py-3 order-2 sm:order-1"
            >
              Clear
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-slate-600 hover:bg-slate-500 text-white font-medium py-3 order-1 sm:order-2"
              disabled={!startDate || !endDate}
            >
              Apply Filter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
