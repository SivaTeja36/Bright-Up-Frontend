import { useState, useEffect } from 'react';
import { Grid, Box, Card, CardContent, Typography, CardHeader, useTheme } from '@mui/material';
import { Users, BookOpen, CalendarDays, GraduationCap, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from 'recharts';
import { getAllBatches } from '../api/batch';
import { getAllStudents } from '../api/student';
import { getAllSyllabi } from '../api/syllabus';
import AnimatedPage from '../components/AnimatedPage';
import AnimatedCard from '../components/AnimatedCard';
import StatsCard from '../components/StatsCard';
import PageHeader from '../components/PageHeader';

const Dashboard = () => {
  const theme = useTheme();
  const [batchCount, setBatchCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [syllabusCount, setSyllabusCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const [batches, students, syllabi] = await Promise.all([
          getAllBatches(),
          getAllStudents(),
          getAllSyllabi()
        ]);
        
        setBatchCount(batches.length);
        setStudentCount(students.length);
        setSyllabusCount(syllabi.length);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const monthlyEnrollmentData = [
    { name: 'Jan', students: 25 },
    { name: 'Feb', students: 32 },
    { name: 'Mar', students: 28 },
    { name: 'Apr', students: 40 },
    { name: 'May', students: 35 },
    { name: 'Jun', students: 55 },
    { name: 'Jul', students: 60 },
  ];

  const courseDistributionData = [
    { name: 'Web Dev', value: 45 },
    { name: 'Mobile Dev', value: 30 },
    { name: 'Data Science', value: 20 },
    { name: 'DevOps', value: 15 },
  ];

  const COLORS = ['#00BFFF', '#8A2BE2', '#1DE9B6', '#FFB74D'];

  const revenueData = [
    { name: 'Jan', revenue: 12000 },
    { name: 'Feb', revenue: 19000 },
    { name: 'Mar', revenue: 17000 },
    { name: 'Apr', revenue: 21000 },
    { name: 'May', revenue: 25000 },
    { name: 'Jun', revenue: 32000 },
    { name: 'Jul', revenue: 38000 },
  ];

  return (
    <AnimatedPage>
      <PageHeader 
        title="Dashboard" 
        subtitle="Welcome to Brightup Admin Portal"
      />
      
      <Grid container spacing={3}>
        {/* Stats Cards */}
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Students"
            value={loading ? '...' : studentCount}
            icon={<GraduationCap size={24} />}
            color="#00BFFF"
            increase="+12% from last month"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Active Batches"
            value={loading ? '...' : batchCount}
            icon={<CalendarDays size={24} />}
            color="#1DE9B6"
            increase="+3 new this month"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Syllabus Available"
            value={loading ? '...' : syllabusCount}
            icon={<BookOpen size={24} />}
            color="#8A2BE2"
            increase="+5 added recently"
          />
        </Grid>
        
        <Grid item xs={12} sm={6} lg={3}>
          <StatsCard
            title="Total Revenue"
            value="₹135,420"
            icon={<TrendingUp size={24} />}
            color="#FFB74D"
            increase="+8.2% growth rate"
          />
        </Grid>

        {/* Monthly Enrollment Chart */}
        <Grid item xs={12} lg={8}>
          <AnimatedCard delay={0.2}>
            <CardHeader title="Monthly Student Enrollment" />
            <CardContent>
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer>
                  <BarChart data={monthlyEnrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(16, 42, 67, 0.9)', 
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 8
                      }} 
                    />
                    <Bar dataKey="students" fill="url(#colorGradient)" radius={[4, 4, 0, 0]} />
                    <defs>
                      <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#8A2BE2" stopOpacity={1} />
                        <stop offset="100%" stopColor="#00BFFF" stopOpacity={0.6} />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </AnimatedCard>
        </Grid>

        {/* Course Distribution Chart */}
        <Grid item xs={12} md={6} lg={4}>
          <AnimatedCard delay={0.3}>
            <CardHeader title="Course Distribution" />
            <CardContent>
              <Box sx={{ height: 300, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={courseDistributionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {courseDistributionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(16, 42, 67, 0.9)', 
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 8
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </AnimatedCard>
        </Grid>

        {/* Revenue Chart */}
        <Grid item xs={12}>
          <AnimatedCard delay={0.4}>
            <CardHeader title="Monthly Revenue" />
            <CardContent>
              <Box sx={{ height: 300, width: '100%' }}>
                <ResponsiveContainer>
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="name" stroke="rgba(255,255,255,0.7)" />
                    <YAxis stroke="rgba(255,255,255,0.7)" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(16, 42, 67, 0.9)', 
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: 8
                      }} 
                      formatter={(value) => [`₹${value}`, 'Revenue']}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#1DE9B6"
                      strokeWidth={3}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </AnimatedCard>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={6}>
          <AnimatedCard delay={0.5}>
            <CardHeader title="Recent Activities" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { action: 'New student enrolled', target: 'John Doe', time: '2 hours ago' },
                  { action: 'Updated syllabus', target: 'React Fundamentals', time: '5 hours ago' },
                  { action: 'Created new batch', target: 'Mobile Development #12', time: 'Yesterday' },
                  { action: 'Added new schedule', target: 'Web Dev Batch', time: '2 days ago' },
                ].map((activity, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'rgba(0, 0, 0, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {activity.action}: <span style={{ color: theme.palette.primary.main }}>{activity.target}</span>
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </AnimatedCard>
        </Grid>

        {/* Upcoming Classes */}
        <Grid item xs={12} md={6}>
          <AnimatedCard delay={0.6}>
            <CardHeader title="Upcoming Classes" />
            <CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {[
                  { course: 'React Fundamentals', batch: 'Web Dev Batch #8', time: 'Today, 2:00 PM - 4:00 PM' },
                  { course: 'UI/UX Design', batch: 'Design Batch #3', time: 'Today, 5:00 PM - 7:00 PM' },
                  { course: 'Flutter Development', batch: 'Mobile Dev Batch #5', time: 'Tomorrow, 10:00 AM - 12:00 PM' },
                  { course: 'Advanced JavaScript', batch: 'Web Dev Batch #7', time: 'Tomorrow, 3:00 PM - 5:00 PM' },
                ].map((classInfo, index) => (
                  <Box
                    key={index}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: 'rgba(0, 0, 0, 0.15)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                    }}
                  >
                    <Typography variant="body2" fontWeight={500}>
                      {classInfo.course}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {classInfo.batch}
                    </Typography>
                    <Typography variant="caption" color="primary.main">
                      {classInfo.time}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </AnimatedCard>
        </Grid>
      </Grid>
    </AnimatedPage>
  );
};

export default Dashboard;