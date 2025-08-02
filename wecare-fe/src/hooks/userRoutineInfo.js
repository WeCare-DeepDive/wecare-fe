import { useEffect, useState, useCallback } from "react";
import {
  getRoutine,
  getGuardianRoutine,
  getDependentRoutine,
} from "../providers/api";

import {
  routineGuardian,
  routineDependent,
} from "../mocks/routineMock";

export function useRoutineInfo({ mode = "routines", routineId = null, useMock = false, targetId = null } = {}) {
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoutineInfo = useCallback(async () => {
    setLoading(true);
    try {
      let routineInfo;

      if (useMock) {
        // ✅ 목업 데이터 사용 분기
        switch (mode) {
          case "routines":
            routineInfo = routineGuardian;
            console.log('🔍 useRoutineInfo routineInfo: ', routineInfo);
            break;
          case "detail":
            if (!routineId) throw new Error("루틴 ID가 필요합니다.");
            routineInfo = routineGuardian.find((r) => r.id === routineId);
            if (!routineInfo) throw new Error("루틴을 찾을 수 없습니다.");
            break;
          default:
            throw new Error("알 수 없는 루틴 모드입니다.");
        }
      } else {
        // ✅ 실제 API 호출
        switch (mode) {
          case "routines":
            routineInfo = await getGuardianRoutine(targetId);
            break;
          case "detail":
            if (!routineId) throw new Error("루틴 ID가 필요합니다.");
            routineInfo = await getRoutine(routineId);
            break;
          default:
            throw new Error("알 수 없는 루틴 모드입니다.");
        }
      }

      setRoutine(routineInfo);
    } catch (err) {
      console.error("❌ 루틴 정보 가져오기 실패:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [mode, routineId, useMock, targetId]);

  useEffect(() => {
    fetchRoutineInfo();
  }, [fetchRoutineInfo]);

  return { routine, loading, error, refetch: fetchRoutineInfo };
}
