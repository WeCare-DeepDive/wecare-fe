// hooks/useDateFormat.js

export function useDateFormat() {
    // ⏱️ 시간 문자열 포맷팅
    const formatTime = (timeString) => {
      // 새로운 시간 객체 형태인 경우: { hour: 9, minute: 30 }
      if (typeof timeString === 'object' && timeString?.hour !== undefined) {
        const hours = timeString.hour.toString().padStart(2, '0');
        const minutes = timeString.minute.toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      }
  
      // 기존 문자열(Date) 형태인 경우
      const date = new Date(timeString);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    };
  
    // 🌓 오전/오후 판단
    const formatAmPm = (timeString) => {
      if (typeof timeString === 'object' && timeString?.hour !== undefined) {
        return timeString.hour < 12 ? '오전' : '오후';
      }
  
      const date = new Date(timeString);
      const hours = date.getHours();
      return hours < 12 ? '오전' : '오후';
    };

    // 날짜 + 시간 포멧
    const formatDate = (datetime) => {
        const date = new Date(datetime);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const time = formatTime(date);
        return `${month}/${day} ${time}`;
    }
  
    // 🕐 시간 범위 표시
    const formatTimeRange = (startTime, endTime) => {
      const start = formatTime(startTime);
      const end = formatTime(endTime);
      const amPm = formatAmPm(startTime);
      return `${amPm} ${start} ~ ${end}`;
    };
    
    // 시간 범위 포맷2
    const stringFormatTimeRange = (startTime, endTime) => {
      //15:30:00 ~ 15:40:00
      const start = startTime.split(':');
      const end = endTime.split(':');
      const startHour = start[0];
      const startMinute = start[1];
      const endHour = end[0];
      const endMinute = end[1];
      // 오전 오후 판단
      const amPm = startHour < 12 ? '오전' : '오후';
      return `${amPm} ${startHour}:${startMinute} ~ ${endHour}:${endMinute}`;
    }

    return {
      formatTime,
      formatAmPm,
      formatTimeRange,
      formatDate,
      stringFormatTimeRange
    };
  }
  