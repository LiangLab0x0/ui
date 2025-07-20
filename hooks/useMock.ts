// Mock data hook for aidd-Bio UI
// 模拟数据钩子，用于 UI 原型展示

interface MockData {
  gpu_util: number;
  targets_validated: number;
  seq_designed: number;
  lnp_pool: number;
  dbtl_cycles: number;
  viewer: string;
  safety: {
    immunogenicity: 'low' | 'medium' | 'high';
    toxicity: 'low' | 'medium' | 'high';
  };
}

// 初始模拟数据 (Initial mock data)
const initialMockData: MockData = {
  gpu_util: 78,
  targets_validated: 124,
  seq_designed: 3120,
  lnp_pool: 842,
  dbtl_cycles: 9,
  viewer: "JAK3_AF3_model.cif",
  safety: { 
    immunogenicity: "low", 
    toxicity: "medium" 
  }
};

// 模拟数据获取函数 (Mock data fetch function)
export async function fetchMockData(): Promise<MockData> {
  // 模拟网络延迟 (Simulate network delay)
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // 添加一些随机变化 (Add some random variations)
  return {
    ...initialMockData,
    gpu_util: 70 + Math.floor(Math.random() * 25),
    targets_validated: initialMockData.targets_validated + Math.floor(Math.random() * 5),
    seq_designed: initialMockData.seq_designed + Math.floor(Math.random() * 50)
  };
}

// React Hook 示例 (React Hook example)
export function useMock() {
  const [data, setData] = useState<MockData>(initialMockData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const newData = await fetchMockData();
      setData(newData);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // 初始加载 (Initial load)
    refresh();
    
    // 定期更新 GPU 使用率 (Periodically update GPU usage)
    const interval = setInterval(() => {
      setData(prev => ({
        ...prev,
        gpu_util: 70 + Math.floor(Math.random() * 25)
      }));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [refresh]);

  return { data, loading, error, refresh };
}

// 用于 TypeScript 的占位符导入 (Placeholder imports for TypeScript)
declare const useState: any;
declare const useCallback: any;
declare const useEffect: any;