// server/db.ts - Mock database for demo purposes
import * as schema from "../shared/schema";

// Mock database implementation for demo
export const db = {
  insert: (table: any) => ({
    values: (data: any) => ({
      returning: () => {
        console.log(`📝 Mock DB: Inserted into ${table}`, data);
        return [{ id: Math.random(), ...data, createdAt: new Date() }];
      }
    })
  }),
  
  select: () => ({
    from: (table: any) => ({
      where: (condition: any) => ({
        limit: (count: number) => {
          console.log(`📝 Mock DB: Selected from ${table}`, { condition, limit: count });
          return [];
        },
        orderBy: (field: any) => ({
          limit: (count: number) => {
            console.log(`📝 Mock DB: Selected from ${table}`, { condition, orderBy: field, limit: count });
            return [];
          }
        })
      })
    })
  }),
  
  update: (table: any) => ({
    set: (data: any) => ({
      where: (condition: any) => ({
        returning: () => {
          console.log(`📝 Mock DB: Updated ${table}`, { data, condition });
          return [];
        }
      })
    })
  })
};

console.log('🗄️  Using mock database for demo purposes');
console.log('📝 All data operations are logged to console');