// 晶体结构显示组件的样式

// 主容器样式
export const crystalContainerStyles = {
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    padding: '20px',
    maxHeight: 'calc(100vh - 100px)', // 限制最大高度
    overflow: 'hidden' // 防止溢出
  }
};

// 工具面板样式
export const toolsPanelStyles = {
  panel: {
    flex: '0 0 250px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    maxHeight: 'calc(100vh - 140px)', // 限制最大高度
    overflowY: 'auto', // 允许垂直滚动
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  section: {
    marginBottom: '15px'
  },
  sectionTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#333'
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  optionButton: {
    padding: '8px 12px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    color: '#333'
  },
  activeOptionButton: {
    padding: '8px 12px',
    backgroundColor: '#e6f7ff',
    border: '1px solid #1890ff',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    color: '#1890ff'
  },
  select: {
    padding: '8px 12px',
    width: '100%',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '14px'
  },
  icon: {
    fontSize: '16px'
  }
};

// 查看器面板样式
export const viewerPanelStyles = {
  panel: {
    flex: '1 1 500px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    maxHeight: 'calc(100vh - 140px)' // 限制最大高度
  },
  toolbar: {
    padding: '10px 15px',
    borderBottom: '1px solid #eee',
    display: 'flex',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa'
  },
  toolbarGroup: {
    display: 'flex',
    gap: '10px'
  },
  toolbarButton: {
    padding: '6px 12px',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    color: '#333'
  },
  activeToolbarButton: {
    padding: '6px 12px',
    backgroundColor: '#e6f7ff',
    border: '1px solid #1890ff',
    borderRadius: '4px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    transition: 'all 0.2s ease',
    color: '#1890ff'
  },
  container: {
    flex: '1',
    position: 'relative',
    overflow: 'hidden'
  },
  viewer: {
    width: '100%',
    height: '100%',
    minHeight: '400px',
    maxHeight: 'calc(100vh - 200px)' // 限制最大高度
  }
};

// 信息面板样式
export const infoPanelStyles = {
  panel: {
    flex: '0 0 250px',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    padding: '15px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    maxHeight: 'calc(100vh - 140px)', // 限制最大高度
    overflowY: 'auto' // 允许垂直滚动
  },
  title: {
    fontSize: '18px',
    fontWeight: '600',
    marginBottom: '15px',
    color: '#333'
  },
  section: {
    marginBottom: '15px',
    padding: '10px',
    backgroundColor: '#fff',
    borderRadius: '4px',
    border: '1px solid #eee'
  },
  sectionTitle: {
    fontSize: '15px',
    fontWeight: '600',
    marginBottom: '10px',
    color: '#333'
  },
  item: {
    display: 'flex',
    marginBottom: '8px',
    fontSize: '14px'
  },
  label: {
    flex: '0 0 100px',
    fontWeight: '500',
    color: '#666'
  },
  value: {
    flex: '1',
    color: '#333'
  }
};

// 响应式布局样式
export const responsiveStyles = {
  // 大屏幕布局
  large: {
    container: {
      gridTemplateColumns: '280px 1fr 320px'
    }
  },
  // 中等屏幕布局
  medium: {
    container: {
      gridTemplateColumns: '220px 1fr 280px'
    }
  },
  // 小屏幕布局
  small: {
    container: {
      gridTemplateColumns: '220px 1fr',
      gridTemplateRows: 'auto 1fr',
      gridTemplateAreas: `
        "tools viewer"
        "info viewer"
      `
    },
    toolsPanel: {
      gridArea: 'tools'
    },
    viewerPanel: {
      gridArea: 'viewer'
    },
    infoPanel: {
      gridArea: 'info'
    }
  },
  // 超小屏幕布局
  xsmall: {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gridTemplateColumns: 'unset',
      gridTemplateRows: 'unset',
      gridTemplateAreas: 'unset',
      height: 'auto',
      minHeight: 'calc(100vh - 160px)'
    },
    toolsPanel: {
      order: 1,
      height: 'auto',
      maxHeight: 'none',
      minHeight: 'auto',
      flex: '0 0 auto',
      gridArea: 'unset'
    },
    viewerPanel: {
      order: 2,
      minHeight: '500px',
      flex: '1 0 auto',
      gridArea: 'unset'
    },
    infoPanel: {
      order: 3,
      height: 'auto',
      minHeight: '300px',
      flex: '0 0 auto',
      gridArea: 'unset'
    }
  }
}; 